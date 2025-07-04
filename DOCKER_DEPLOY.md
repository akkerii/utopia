# 🐳 Docker Deployment Guide

## Quick Docker Deploy (3 Steps)

### 1️⃣ Copy to EC2

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude '.next' . ubuntu@3.82.158.36:/tmp/utopia-ai
```

### 2️⃣ SSH and Deploy

```bash
ssh ubuntu@3.82.158.36
cd /tmp/utopia-ai
sudo bash deploy-docker.sh
```

### 3️⃣ Enter your OpenAI API key when prompted

**That's it!** Your containerized app will be live at http://3.82.158.36 in about 10 minutes.

---

## What the Docker Deployment Does

The `deploy-docker.sh` script:

- ✅ Installs Docker & Docker Compose
- ✅ Builds 3 containers:
  - **Backend** (Node.js API on port 3001)
  - **Frontend** (Next.js app on port 3000)
  - **Nginx** (Reverse proxy on port 80)
- ✅ Sets up container networking
- ✅ Configures health checks
- ✅ Sets up auto-restart policies
- ✅ Configures firewall

## Container Architecture

```
Internet → Nginx (Port 80) → Frontend (Port 3000)
                          ↘ Backend (Port 3001)
```

## After Deployment

Check your app:

- **Frontend**: http://3.82.158.36
- **API**: http://3.82.158.36/api
- **Health**: http://3.82.158.36/health

## Container Management

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx

# Restart containers
docker-compose restart

# Stop/Start containers
docker-compose down
docker-compose up -d

# Update app (after code changes)
./update-docker.sh

# Check resource usage
docker stats
```

## GitHub Actions CI/CD

The GitHub Actions workflow will:

1. **Test builds** locally
2. **Package** the application
3. **Deploy** to EC2 using Docker
4. **Health check** all services
5. **Notify** deployment status

### Required Secrets

Add these to your GitHub repository secrets:

- `EC2_HOST`: `3.82.158.36`
- `EC2_USERNAME`: `ubuntu`
- `EC2_SSH_KEY`: Your private SSH key
- `OPENAI_API_KEY`: Your OpenAI API key

## Advantages of Docker Deployment

- 🔒 **Isolated environments** - No dependency conflicts
- 🚀 **Consistent deployments** - Same environment everywhere
- 📦 **Easy scaling** - Add more containers as needed
- 🔄 **Zero-downtime updates** - Rolling updates
- 🛡️ **Security** - Containerized isolation
- 📊 **Monitoring** - Built-in health checks

## Troubleshooting

```bash
# Check container logs
docker-compose logs --tail=50

# Check container health
docker-compose ps

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check resource usage
docker stats --no-stream

# Clean up unused resources
docker system prune
```

## Production Considerations

- **SSL Certificate**: Add domain and SSL
- **Monitoring**: Set up logging and monitoring
- **Backups**: Backup container volumes
- **Scaling**: Use Docker Swarm or Kubernetes
- **Security**: Regular security updates

Ready to deploy? Just run the 3 commands above!
