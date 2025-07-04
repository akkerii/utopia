# Quick Deployment Guide

## One-Script Deployment for EC2

This guide will help you deploy your Utopia AI application to your EC2 instance at **3.82.158.36** with a single script.

## Prerequisites

- EC2 instance with Ubuntu (20.04 or newer)
- SSH access to your instance
- Your OpenAI API key

## Step 1: Prepare Locally (Optional)

If you want to create the environment files before copying:

```bash
# Make scripts executable
chmod +x prepare-deployment.sh deploy.sh

# Run preparation (creates env files)
./prepare-deployment.sh
```

## Step 2: Copy to EC2

Copy the entire project to your EC2 instance:

```bash
# Using SCP
scp -r . ubuntu@3.82.158.36:/tmp/utopia-ai

# OR using rsync (faster, skips unnecessary files)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' . ubuntu@3.82.158.36:/tmp/utopia-ai
```

## Step 3: Deploy on EC2

SSH into your instance and run the deployment script:

```bash
# SSH into the instance
ssh ubuntu@3.82.158.36

# Navigate to the project
cd /tmp/utopia-ai

# Run the deployment script
sudo bash deploy.sh
```

The script will:

1. Ask for your OpenAI API key
2. Install all dependencies (Node.js, nginx, PM2)
3. Build and start both frontend and backend
4. Configure nginx as reverse proxy
5. Set up auto-restart on reboot

## Step 4: Access Your Application

After deployment completes, your app will be available at:

- **Frontend**: http://3.82.158.36
- **API**: http://3.82.158.36/api

## What the Script Does

- ✅ Installs Node.js 20.x, pnpm, PM2, and nginx
- ✅ Sets up the backend on port 3001
- ✅ Sets up the frontend on port 3000
- ✅ Configures nginx to proxy requests
- ✅ Creates environment files with your API key
- ✅ Builds both applications
- ✅ Sets up PM2 for process management
- ✅ Configures firewall rules
- ✅ Creates update scripts for future deployments

## Useful Commands (On Server)

```bash
# Check application status
pm2 status

# View logs
pm2 logs                    # All logs
pm2 logs utopia-backend     # Backend only
pm2 logs utopia-frontend    # Frontend only

# Restart applications
pm2 restart all

# Update application (after code changes)
/var/www/utopia-ai/update.sh

# Monitor resources
pm2 monit
```

## Troubleshooting

If something goes wrong:

1. **Check PM2 logs**: `pm2 logs --lines 50`
2. **Check nginx**: `sudo systemctl status nginx`
3. **Check nginx error logs**: `sudo tail -f /var/log/nginx/error.log`
4. **Verify services are running**: `pm2 list`

## Security Notes

- The script configures UFW firewall (ports 22, 80, 443)
- Consider setting up SSL with a domain name
- Keep your OpenAI API key secure

That's it! Your application should be running in just a few minutes.
