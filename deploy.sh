#!/bin/bash

# Utopia AI Deployment Script
# This script will set up everything needed to run the application on EC2

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PUBLIC_IP="3.82.158.36"
BACKEND_PORT=3001
FRONTEND_PORT=3000
APP_DIR="/var/www/utopia-ai"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Utopia AI Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Function to print colored messages
print_status() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓ $1${NC}"
}

print_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗ $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

# Ask for OpenAI API Key
echo -e "${YELLOW}Please enter your OpenAI API Key:${NC}"
read -s OPENAI_API_KEY
echo ""

if [ -z "$OPENAI_API_KEY" ]; then
    print_error "OpenAI API Key is required!"
    exit 1
fi

print_status "Starting deployment process..."

# Update system packages
print_status "Updating system packages..."
apt-get update -y
apt-get upgrade -y
print_success "System packages updated"

# Install Node.js 20.x
print_status "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
print_success "Node.js installed: $(node --version)"

# Install pnpm
print_status "Installing pnpm..."
npm install -g pnpm@latest
print_success "pnpm installed: $(pnpm --version)"

# Install PM2
print_status "Installing PM2..."
npm install -g pm2@latest
print_success "PM2 installed"

# Install nginx
print_status "Installing nginx..."
apt-get install -y nginx
print_success "nginx installed"

# Install build essentials
print_status "Installing build essentials..."
apt-get install -y build-essential
print_success "Build essentials installed"

# Create application directory
print_status "Creating application directory..."
mkdir -p $APP_DIR
print_success "Created directory: $APP_DIR"

# Copy application files
print_status "Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR
print_success "Application files copied"

# Create environment files
print_status "Creating environment files..."

# Backend .env
cat > $APP_DIR/utopia-backend/.env << EOF
NODE_ENV=production
PORT=$BACKEND_PORT
OPENAI_API_KEY=$OPENAI_API_KEY
EOF
print_success "Backend .env created"

# Frontend .env.local
cat > $APP_DIR/utopia-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:$BACKEND_PORT/api
EOF
print_success "Frontend .env.local created"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd $APP_DIR/utopia-backend
pnpm install
print_success "Backend dependencies installed"

# Build backend
print_status "Building backend..."
pnpm run build
print_success "Backend built successfully"

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd $APP_DIR/utopia-frontend
pnpm install
print_success "Frontend dependencies installed"

# Build frontend
print_status "Building frontend..."
pnpm run build
print_success "Frontend built successfully"

# Configure PM2
print_status "Configuring PM2..."

# Create PM2 ecosystem file
cat > $APP_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'utopia-backend',
      cwd: '/var/www/utopia-ai/utopia-backend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/www/utopia-ai/logs/backend-error.log',
      out_file: '/var/www/utopia-ai/logs/backend-out.log',
      time: true
    },
    {
      name: 'utopia-frontend',
      cwd: '/var/www/utopia-ai/utopia-frontend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/utopia-ai/logs/frontend-error.log',
      out_file: '/var/www/utopia-ai/logs/frontend-out.log',
      time: true
    }
  ]
};
EOF

# Create logs directory
mkdir -p $APP_DIR/logs

# Start applications with PM2
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root
print_success "PM2 configured and applications started"

# Configure nginx
print_status "Configuring nginx..."

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create nginx configuration
cat > /etc/nginx/sites-available/utopia-ai << EOF
server {
    listen 80;
    server_name $PUBLIC_IP;

    # Frontend proxy
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Increase timeout for AI responses
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/utopia-ai /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx
systemctl enable nginx
print_success "nginx configured and restarted"

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
print_success "Firewall configured"

# Create update script
print_status "Creating update script..."
cat > $APP_DIR/update.sh << 'EOF'
#!/bin/bash
cd /var/www/utopia-ai

echo "Updating backend..."
cd utopia-backend
pnpm install
pnpm run build

echo "Updating frontend..."
cd ../utopia-frontend
pnpm install
pnpm run build

echo "Restarting services..."
pm2 restart all

echo "Update complete!"
EOF
chmod +x $APP_DIR/update.sh
print_success "Update script created"

# Create useful commands reference
cat > $APP_DIR/COMMANDS.md << 'EOF'
# Useful Commands

## PM2 Commands
- `pm2 status` - Check application status
- `pm2 logs` - View all logs
- `pm2 logs utopia-backend` - View backend logs
- `pm2 logs utopia-frontend` - View frontend logs
- `pm2 restart all` - Restart all applications
- `pm2 monit` - Interactive monitoring

## Nginx Commands
- `systemctl status nginx` - Check nginx status
- `systemctl restart nginx` - Restart nginx
- `nginx -t` - Test nginx configuration
- `tail -f /var/log/nginx/error.log` - View nginx error logs

## Update Application
- `/var/www/utopia-ai/update.sh` - Update and restart the application

## View Application Logs
- `tail -f /var/www/utopia-ai/logs/backend-out.log` - Backend output
- `tail -f /var/www/utopia-ai/logs/backend-error.log` - Backend errors
- `tail -f /var/www/utopia-ai/logs/frontend-out.log` - Frontend output
- `tail -f /var/www/utopia-ai/logs/frontend-error.log` - Frontend errors
EOF

print_success "Commands reference created at $APP_DIR/COMMANDS.md"

# Final status check
print_status "Performing final status check..."
sleep 5  # Wait for services to stabilize

# Check if services are running
if pm2 list | grep -q "online"; then
    print_success "Applications are running!"
else
    print_error "Applications may not be running properly. Check pm2 logs."
fi

# Check if nginx is running
if systemctl is-active --quiet nginx; then
    print_success "nginx is running!"
else
    print_error "nginx is not running properly."
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}Your application is now available at:${NC}"
echo -e "${GREEN}  Frontend: http://$PUBLIC_IP${NC}"
echo -e "${GREEN}  API: http://$PUBLIC_IP/api${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  pm2 status         - Check application status"
echo "  pm2 logs           - View application logs"
echo "  pm2 restart all    - Restart all services"
echo ""
echo -e "${YELLOW}For more commands, see: $APP_DIR/COMMANDS.md${NC}"
echo "" 