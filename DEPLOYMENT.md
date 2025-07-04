# Utopia AI Deployment Guide

This guide will help you deploy the Utopia AI application to your server at 13.222.210.195.

## Prerequisites

1. **Server Requirements:**

   - Ubuntu 20.04 LTS or newer (Debian-based)
   - Minimum 2GB RAM
   - 20GB available disk space
   - Root or sudo access

2. **Local Requirements:**
   - SSH access to the server
   - OpenAI API key ready

## Quick Start

1. **Prepare the project locally:**

   ```bash
   # Make the deployment script executable
   chmod +x deploy.sh

   # Optional: Run the preparation script
   chmod +x prepare-deployment.sh
   ./prepare-deployment.sh
   ```

2. **Copy the project to your server:**

   ```bash
   # Copy the entire project to the server
   scp -r . root@13.222.210.195:/tmp/utopia-ai-deploy

   # Or use rsync for better performance
   rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' . root@13.222.210.195:/tmp/utopia-ai-deploy
   ```

3. **SSH into your server:**

   ```bash
   ssh root@13.222.210.195
   ```

4. **Run the deployment script:**

   ```bash
   cd /tmp/utopia-ai-deploy
   sudo bash deploy.sh
   ```

5. **Follow the prompts:**
   - Enter your OpenAI API key when prompted
   - The script will handle everything else automatically

## What the Deployment Script Does

1. **System Setup:**

   - Updates system packages
   - Installs Node.js v20
   - Installs pnpm, PM2, and nginx
   - Configures firewall rules

2. **Application Setup:**

   - Copies files to `/var/www/utopia-ai`
   - Creates environment files with your OpenAI key
   - Installs dependencies for both frontend and backend
   - Builds both applications

3. **Service Configuration:**

   - Sets up PM2 to manage both applications
   - Configures nginx as reverse proxy
   - Enables auto-start on system boot

4. **Additional Scripts:**
   - `/var/www/utopia-ai/update.sh` - Update the application
   - `/var/www/utopia-ai/setup-ssl.sh` - Setup SSL certificate
   - `/var/www/utopia-ai/COMMANDS.md` - Useful commands reference

## Post-Deployment

### Access Your Application

After deployment, your application will be available at:

- **Main App:** http://13.222.210.195
- **API Endpoint:** http://13.222.210.195/api

### Setting Up a Domain (Optional)

If you have a domain name:

1. Point your domain to 13.222.210.195
2. SSH into the server
3. Run the SSL setup script:
   ```bash
   /var/www/utopia-ai/setup-ssl.sh your-domain.com
   ```

### Monitoring

View application logs:

```bash
pm2 logs                    # All logs
pm2 logs utopia-backend     # Backend only
pm2 logs utopia-frontend    # Frontend only
```

Check application status:

```bash
pm2 status
```

### Updating the Application

To update after making changes:

1. Copy updated files to the server
2. Run the update script:
   ```bash
   /var/www/utopia-ai/update.sh
   ```

## Troubleshooting

### Application Not Starting

Check PM2 logs:

```bash
pm2 logs --lines 50
```

### Nginx Issues

Check nginx configuration:

```bash
nginx -t
systemctl status nginx
```

Check nginx logs:

```bash
tail -f /var/log/nginx/error.log
```

### Port Conflicts

If ports 3000 or 3001 are already in use:

1. Edit the deployment script before running
2. Change `BACKEND_PORT` and `FRONTEND_PORT` variables

### OpenAI API Issues

Verify your API key is set correctly:

```bash
cat /var/www/utopia-ai/utopia-backend/.env
```

## Security Recommendations

1. **Use HTTPS:** Run the SSL setup script with your domain
2. **Firewall:** The script configures UFW automatically
3. **Updates:** Regularly update your system and dependencies
4. **Monitoring:** Set up monitoring for your services

## Manual Commands

If you need to manage services manually:

```bash
# Restart all services
pm2 restart all

# Restart nginx
sudo systemctl restart nginx

# Stop all services
pm2 stop all

# Start all services
pm2 start all

# View PM2 dashboard
pm2 monit
```

## Environment Variables

The deployment creates these environment files:

**Backend** (`/var/www/utopia-ai/utopia-backend/.env`):

```
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=your-key-here
```

**Frontend** (`/var/www/utopia-ai/utopia-frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Support

If you encounter issues:

1. Check the logs first
2. Ensure all prerequisites are met
3. Verify your OpenAI API key is valid
4. Check that ports 80, 3000, and 3001 are not blocked

Remember to keep your OpenAI API key secure and never commit it to version control!
