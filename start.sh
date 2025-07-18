#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 18
nvm use 18

# Set environment variables
export NODE_OPTIONS='--no-experimental-fetch --experimental-global-webcrypto'
export DATABASE_URL="postgresql://jack_admin:root@localhost:5432/jack_port"
export JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
export NODE_ENV=development

# Check if Node.js version is correct
if [[ $(node --version) != v18* ]]; then
    echo "Error: Please make sure Node.js 18 is installed and active"
    echo "Run: nvm install 18 && nvm use 18"
    exit 1
fi

# Start the development server
echo "Starting development server..."
npm run dev 