#!/bin/bash

# Portfolio Project Setup Script
echo "🚀 Setting up Portfolio Project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your database credentials"
    echo "   Required: DATABASE_URL and JWT_SECRET"
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL=postgresql://" .env; then
    echo "⚠️  Please set DATABASE_URL in .env file"
    echo "   Example: DATABASE_URL=postgresql://username:password@localhost:5432/database_name"
fi

# Check if JWT_SECRET is set
if ! grep -q "JWT_SECRET=" .env || grep -q "JWT_SECRET=your-super-secret" .env; then
    echo "⚠️  Please set a strong JWT_SECRET in .env file"
    echo "   Example: JWT_SECRET=$(openssl rand -base64 32)"
fi

echo "🔧 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Ensure PostgreSQL is running"
echo "3. Run: npm run db:push"
echo "4. Run: npm run dev"
echo ""
echo "📖 See LOCAL_SETUP.md for detailed instructions"