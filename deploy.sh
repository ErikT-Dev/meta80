#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# CHANGE THIS: Navigate to your project root directory
# If you run this script from the project root, you can leave this as is
cd "$(dirname "$0")"

echo "Cleaning up previous build artifacts..."
rm -rf frontend/dist
rm -rf backend/public/*

# CHANGE THIS: Update the frontend directory name if different
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Preparing deployment directory..."
rm -rf deploy
mkdir -p deploy/public

# CHANGE THIS: Update the backend directory name if different
echo "Copying backend files..."
cp -r backend/* deploy/

# Remove the database_setup folder from the deploy directory
rm -rf deploy/database_setup

# Exclude node_modules if it exists
rm -rf deploy/node_modules

# CHANGE THIS: Update the path to your built frontend files
# This path depends on your Angular output directory configuration
echo "Copying built frontend files..."
cp -r frontend/dist/mean-movies/browser/* deploy/public/

# CHANGE THIS: Modify the runtime if you're not using Node.js 18
# Add any other App Engine configurations you need
echo "Creating app.yaml..."
cat > deploy/app.yaml << EOL
runtime: nodejs20
env: standard
EOL

# CHANGE THIS: Add your environment variables here
# Be cautious with sensitive data. Consider using Google Cloud Secret Manager for sensitive information
echo "Adding environment variables..."
cat >> deploy/app.yaml << EOL
env_variables:
  NODE_ENV: "production"
  USE_SECURE_COOKIES: "true"
  ALLOWED_ORIGINS: "https://meta80.appspot.com,https://meta80.lm.r.appspot.com"
  MONGODB_URI: "${MONGODB_URI}"
  SESSION_SECRET: "${SESSION_SECRET}"
EOL

# CHANGE THIS: If you have a different project ID or want to specify a region, modify the gcloud command
echo "Deploying to App Engine..."
cd deploy
gcloud app deploy --quiet

echo "Deployment complete!"