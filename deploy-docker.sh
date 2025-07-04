#!/bin/bash

# Docker Deployment Script for Utopia AI
# This script sets up Docker and deploys the application using containers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PUBLIC_IP="3.82.158.36"
APP_DIR="/var/www/utopia-ai"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Utopia AI Docker Deployment${NC}"
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

# Ask for OpenAI API Key if not provided via environment
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}Please enter your OpenAI API Key:${NC}"
    read -s OPENAI_API_KEY
    echo ""
    
    if [ -z "$OPENAI_API_KEY" ]; then
        print_error "OpenAI API Key is required!"
        exit 1
    fi
fi

print_status "Starting Docker deployment process..."

# Update system packages
print_status "Updating system packages..."
apt-get update -y
apt-get upgrade -y
print_success "System packages updated"

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    # Install Docker's official GPG key
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    # Add Docker repository
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    print_success "Docker installed and started"
else
    print_success "Docker already installed"
fi

# Install Docker Compose (standalone)
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# Create application directory
print_status "Setting up application directory..."
mkdir -p $APP_DIR
cp -r . $APP_DIR/
cd $APP_DIR
print_success "Application files copied to $APP_DIR"

# Create .env file for Docker Compose
print_status "Creating environment file..."
cat > .env << EOF
OPENAI_API_KEY=$OPENAI_API_KEY
NODE_ENV=production
PUBLIC_IP=$PUBLIC_IP
EOF
print_success "Environment file created"

# Stop any existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true
print_success "Existing containers stopped"

# Build and start containers
print_status "Building and starting containers..."
docker-compose up -d --build
print_success "Containers built and started"

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
timeout=300  # 5 minutes
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        print_success "Services are healthy!"
        break
    fi
    sleep 10
    elapsed=$((elapsed + 10))
    echo -n "."
done

if [ $elapsed -ge $timeout ]; then
    print_error "Services failed to become healthy within timeout"
    docker-compose logs
    exit 1
fi

# Configure firewall
print_status "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
print_success "Firewall configured"

# Create management scripts
print_status "Creating management scripts..."

# Update script
cat > $APP_DIR/update-docker.sh << 'EOF'
#!/bin/bash
cd /var/www/utopia-ai

echo "Pulling latest changes..."
git pull origin main

echo "Rebuilding and restarting containers..."
docker-compose down
docker-compose up -d --build

echo "Waiting for services to be healthy..."
sleep 30

if docker-compose ps | grep -q "healthy"; then
    echo "✅ Update completed successfully!"
else
    echo "❌ Update failed. Check logs:"
    docker-compose logs
fi
EOF
chmod +x $APP_DIR/update-docker.sh

# Status script
cat > $APP_DIR/status.sh << 'EOF'
#!/bin/bash
echo "=== Container Status ==="
docker-compose ps

echo -e "\n=== Container Logs (last 20 lines) ==="
docker-compose logs --tail=20

echo -e "\n=== System Resources ==="
docker stats --no-stream
EOF
chmod +x $APP_DIR/status.sh

# Commands reference
cat > $APP_DIR/DOCKER_COMMANDS.md << 'EOF'
# Docker Management Commands

## Container Management
- `docker-compose ps` - Show container status
- `docker-compose logs` - View all logs
- `docker-compose logs backend` - View backend logs
- `docker-compose logs frontend` - View frontend logs
- `docker-compose logs nginx` - View nginx logs
- `docker-compose restart` - Restart all containers
- `docker-compose down` - Stop all containers
- `docker-compose up -d` - Start all containers

## Application Management
- `/var/www/utopia-ai/update-docker.sh` - Update application
- `/var/www/utopia-ai/status.sh` - Check application status

## Debugging
- `docker-compose exec backend sh` - Access backend container
- `docker-compose exec frontend sh` - Access frontend container
- `docker-compose exec nginx sh` - Access nginx container
- `docker stats` - Monitor resource usage
- `docker system prune` - Clean up unused resources

## Health Checks
- `curl http://localhost/health` - Nginx health check
- `curl http://localhost/api/health` - Backend health check
- `curl http://localhost:3000` - Frontend health check
EOF

print_success "Management scripts created"

# Final status check
print_status "Performing final status check..."
sleep 5

# Check container status
if docker-compose ps | grep -E "(Up|healthy)"; then
    print_success "All containers are running!"
else
    print_error "Some containers may not be running properly"
    docker-compose ps
fi

# Test endpoints
print_status "Testing endpoints..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_success "Nginx health check passed"
else
    print_error "Nginx health check failed"
fi

if curl -f http://localhost/api/health > /dev/null 2>&1; then
    print_success "Backend API health check passed"
else
    print_error "Backend API health check failed"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Docker Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}Your application is now available at:${NC}"
echo -e "${GREEN}  Frontend: http://$PUBLIC_IP${NC}"
echo -e "${GREEN}  API: http://$PUBLIC_IP/api${NC}"
echo -e "${GREEN}  Health: http://$PUBLIC_IP/health${NC}"
echo ""
echo -e "${YELLOW}Management commands:${NC}"
echo "  docker-compose ps      - Check container status"
echo "  docker-compose logs    - View logs"
echo "  ./update-docker.sh     - Update application"
echo "  ./status.sh            - Check application status"
echo ""
echo -e "${YELLOW}For more commands, see: $APP_DIR/DOCKER_COMMANDS.md${NC}"
echo "" 