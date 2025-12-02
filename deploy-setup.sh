#!/bin/bash

# AI Coach Platform - Deployment Setup Script
# This script helps prepare your project for Render.com deployment

echo "🚀 AI Coach Platform - Deployment Setup"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "ai-coach-backend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js detected: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 18+ first"
    exit 1
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd ai-coach-backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "Installing frontend dependencies..."
cd ../ai-coach-frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Test builds
echo ""
echo "🔨 Testing builds..."

echo "Testing backend build..."
cd ai-coach-backend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

echo "Testing frontend build..."
cd ../ai-coach-frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null)
if [ $? -eq 0 ]; then
    echo ""
    echo "🔐 Generated JWT Secret:"
    echo "JWT_SECRET=$JWT_SECRET"
    echo ""
    echo "💾 Save this JWT secret for your Render environment variables!"
else
    echo ""
    echo "⚠️  Could not generate JWT secret automatically."
    echo "Please generate a 32+ character random string for JWT_SECRET"
fi

echo ""
echo "✅ Setup complete! Your project is ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub if you haven't already"
echo "2. Follow the DEPLOYMENT.md guide to deploy on Render.com"
echo "3. Use the JWT secret generated above in your environment variables"
echo "4. Get your Google Gemini API key from: https://makersuite.google.com/app/apikey"
echo ""
echo "🌐 Deployment URLs (after deployment):"
echo "   Backend:  https://ai-coach-backend.onrender.com"
echo "   Frontend: https://ai-coach-frontend.onrender.com"
echo ""
echo "Happy deploying! 🎉"