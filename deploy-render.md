# Deploy to Render using Docker
# This script automates the deployment process to Render

# Prerequisites:
# 1. Create a Render account at https://render.com
# 2. Connect your GitHub repository
# 3. Use this configuration

# Services Configuration:

## 1. Frontend Service (Next.js)
# - Service Type: Web Service
# - Environment: Docker
# - Dockerfile Path: ./Dockerfile.nextjs
# - Build Command: (leave empty - Docker handles this)
# - Start Command: (leave empty - Docker handles this)
# - Plan: Free
# - Auto-Deploy: Yes

## 2. ML API Service (Python)
# - Service Type: Web Service  
# - Environment: Docker
# - Dockerfile Path: ./Dockerfile.python
# - Build Command: (leave empty - Docker handles this)
# - Start Command: (leave empty - Docker handles this)
# - Plan: Free
# - Auto-Deploy: Yes

## 3. Database Service
# - Service Type: PostgreSQL (free tier)
# - Or use MongoDB Atlas free tier
# - Plan: Free

# Environment Variables to set in Render dashboard:

## Frontend Service:
# NODE_ENV=production
# MONGODB_URI=<your-mongodb-connection-string>
# AI_ML_API_URL=<your-ml-api-render-url>
# JWT_SECRET=<generate-random-secret>
# NEXTAUTH_SECRET=<generate-random-secret>

## ML API Service:
# PORT=8000
# FLASK_ENV=production

echo "📋 Render Deployment Instructions:"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com and create account"
echo "3. Click 'New' → 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Configure services using the settings above"
echo "6. Set environment variables in Render dashboard"
echo "7. Deploy will start automatically"

echo ""
echo "🔗 After deployment, your services will be available at:"
echo "Frontend: https://your-app-name.onrender.com"
echo "ML API: https://your-ml-api-name.onrender.com"
