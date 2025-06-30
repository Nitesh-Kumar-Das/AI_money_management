# Railway Deployment Guide

## Quick Deployment Steps

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Deploy Services

#### Deploy Frontend
```bash
railway up --service frontend
```

#### Deploy ML API
```bash
railway up --service backend
```

#### Add Database
```bash
railway add -s mongodb
```

### 5. Set Environment Variables

#### Frontend Variables:
```bash
railway variables:set NODE_ENV=production
railway variables:set AI_ML_API_URL=${{ backend.url }}
railway variables:set MONGODB_URI=${{ mongodb.connectionString }}
railway variables:set JWT_SECRET=$(openssl rand -base64 32)
railway variables:set NEXTAUTH_SECRET=$(openssl rand -base64 32)
```

#### ML API Variables:
```bash
railway variables:set PORT=8000 --service backend
railway variables:set FLASK_ENV=production --service backend
```

### 6. Custom Domains (Optional)
```bash
railway domain:add your-custom-domain.com
```

## Railway Features:
- $5 free credits monthly
- Automatic SSL certificates
- Environment variables management
- GitHub integration
- Easy scaling
- Built-in monitoring

## Deployment URLs:
After deployment, your services will be available at:
- Frontend: `https://your-project-name.up.railway.app`
- ML API: `https://your-ml-api.up.railway.app`
- Database: Internal Railway network

## Monitoring:
- View logs: `railway logs`
- Check status: `railway status`
- Monitor usage: Railway dashboard
