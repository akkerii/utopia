# 🚀 Deploy Your App Right Now!

## Quick Manual Deployment (Works Immediately)

### Step 1: Copy to EC2

```bash
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'dist' --exclude '.next' . ubuntu@3.82.158.36:/tmp/utopia-ai
```

### Step 2: SSH and Deploy

```bash
ssh ubuntu@3.82.158.36
cd /tmp/utopia-ai
sudo bash deploy-docker.sh
```

### Step 3: Enter your OpenAI API key when prompted

**That's it!** Your app will be live at http://3.82.158.36 in about 10 minutes.

---

## Alternative: Traditional Deployment (Faster)

If Docker is taking too long, use the traditional deployment:

```bash
# Copy to EC2
rsync -avz --exclude 'node_modules' --exclude '.git' . ubuntu@3.82.158.36:/tmp/utopia-ai

# SSH and deploy
ssh ubuntu@3.82.158.36
cd /tmp/utopia-ai
sudo bash deploy.sh
```

This uses PM2 instead of Docker and is usually faster.

---

## GitHub Actions Setup (For Future Auto-Deployment)

To enable auto-deployment on every push, add these secrets to your GitHub repository:

1. Go to: https://github.com/akkerii/utopia/settings/secrets/actions
2. Add these secrets:
   - `EC2_HOST`: `3.82.158.36`
   - `EC2_USERNAME`: `ubuntu`
   - `EC2_SSH_KEY`: Your private SSH key content
   - `OPENAI_API_KEY`: Your OpenAI API key

## Current Status

- ✅ **Code is ready** - All TypeScript errors fixed
- ✅ **Docker setup complete** - All containers configured
- ✅ **Manual deployment ready** - Use commands above
- ⚠️ **GitHub secrets needed** - For auto-deployment

## Choose Your Deployment Method

1. **Docker (Recommended)**: `sudo bash deploy-docker.sh`
2. **Traditional (Faster)**: `sudo bash deploy.sh`
3. **Auto (Future)**: Set up GitHub secrets

Your app will be available at:

- Frontend: http://3.82.158.36
- API: http://3.82.158.36/api

**Ready to deploy? Use the commands above!** 🎉
