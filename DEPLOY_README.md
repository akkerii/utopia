# 🚀 Deploy Utopia AI to EC2 - Simple Steps

## Quick Deploy (3 Steps)

### 1️⃣ Copy to EC2

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' . ubuntu@3.82.158.36:/tmp/utopia-ai
```

### 2️⃣ SSH and Deploy

```bash
ssh ubuntu@3.82.158.36
cd /tmp/utopia-ai
sudo bash deploy.sh
```

### 3️⃣ Enter your OpenAI API key when prompted

**That's it!** Your app will be live at http://3.82.158.36 in about 5 minutes.

---

## What the Script Does

The `deploy.sh` script handles EVERYTHING:

- ✅ Installs Node.js, nginx, PM2
- ✅ Sets up backend (port 3001) and frontend (port 3000)
- ✅ Configures nginx reverse proxy
- ✅ Builds and starts both apps
- ✅ Sets up auto-restart on reboot
- ✅ Configures firewall

## After Deployment

Check your apps:

- Frontend: http://3.82.158.36
- API: http://3.82.158.36/api

View logs:

```bash
pm2 logs
```

## Need Help?

- Full guide: See `QUICK_DEPLOY.md`
- Detailed docs: See `DEPLOYMENT.md`
- Commands reference: `/var/www/utopia-ai/COMMANDS.md` (on server)
