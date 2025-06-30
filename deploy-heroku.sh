# Heroku deployment script
#!/bin/bash

echo "🚀 Deploying AI Expense Tracker to Heroku..."

# Create Heroku apps
echo "Creating Heroku applications..."
heroku create ai-expense-frontend --region us
heroku create ai-expense-ml-api --region us

# Add MongoDB addon
echo "Adding MongoDB addon..."
heroku addons:create mongolab:sandbox -a ai-expense-frontend

# Set environment variables for frontend
echo "Setting environment variables..."
heroku config:set NODE_ENV=production -a ai-expense-frontend
heroku config:set AI_ML_API_URL=https://ai-expense-ml-api.herokuapp.com -a ai-expense-frontend
heroku config:set JWT_SECRET=$(openssl rand -base64 32) -a ai-expense-frontend
heroku config:set NEXTAUTH_SECRET=$(openssl rand -base64 32) -a ai-expense-frontend

# Set environment variables for ML API
heroku config:set PORT=8000 -a ai-expense-ml-api
heroku config:set FLASK_ENV=production -a ai-expense-ml-api

# Build and push Docker containers
echo "Building and pushing containers..."

# Frontend
heroku container:push web -a ai-expense-frontend --context-path . --dockerfile Dockerfile.nextjs
heroku container:release web -a ai-expense-frontend

# ML API
heroku container:push web -a ai-expense-ml-api --context-path . --dockerfile Dockerfile.python
heroku container:release web -a ai-expense-ml-api

echo "✅ Deployment complete!"
echo "Frontend: https://ai-expense-frontend.herokuapp.com"
echo "ML API: https://ai-expense-ml-api.herokuapp.com"
