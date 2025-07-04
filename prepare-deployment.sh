#!/bin/bash

# Prepare Deployment Script
# This script prepares the environment files before deployment

echo "========================================="
echo "   Preparing for Deployment"
echo "========================================="
echo ""

# Create backend .env if it doesn't exist
if [ ! -f "utopia-backend/.env" ]; then
    echo "Creating backend .env file..."
    cat > utopia-backend/.env << EOF
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
EOF
    echo "✓ Backend .env created"
    echo "  ⚠️  Remember to update OPENAI_API_KEY in utopia-backend/.env before deployment!"
else
    echo "✓ Backend .env already exists"
fi

# Create frontend .env.local if it doesn't exist
if [ ! -f "utopia-frontend/.env.local" ]; then
    echo "Creating frontend .env.local file..."
    cat > utopia-frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://3.82.158.36/api
EOF
    echo "✓ Frontend .env.local created"
else
    echo "✓ Frontend .env.local already exists"
fi

echo ""
echo "Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Update OPENAI_API_KEY in utopia-backend/.env (if not already done)"
echo "2. Copy this entire directory to your EC2 instance"
echo "3. Run deploy.sh on the EC2 instance"
echo "" 