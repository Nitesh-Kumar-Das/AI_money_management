# 🤖💰 AI-Powered Expense Tracker with OCR

A modern, intelligent expense tracking application built with Next.js that uses AI insights and OCR technology to automatically extract expense data from receipt images.

## ✨ Features

### 🔍 **OCR Receipt Scanning**
- **📸 Smart Receipt Scanning**: Upload receipt images and automatically extract expense details
- **💸 Amount Detection**: Recognizes Indian currency formats (₹, Rs, INR)
- **🗂️ Category Classification**: AI-powered categorization based on merchant keywords
- **📆 Date Extraction**: Supports multiple date formats (dd/mm/yyyy, mm/dd/yyyy, etc.)
- **📝 Description Parsing**: Extracts merchant names and transaction descriptions
- **🎯 Confidence Scoring**: Provides accuracy metrics for extracted data

### 🤖 **AI & Machine Learning**
- **📊 Smart Analytics**: 3D visualizations and spending pattern analysis
- **🔮 Predictive Budgeting**: ML-powered budget recommendations using Random Forest
- **📈 Trend Analysis**: Monthly spending trends and category breakdowns
- **⚡ Real-time Insights**: Dynamic dashboard with personalized recommendations
- **🎯 Anomaly Detection**: Identify unusual spending patterns
- **📊 Category Predictions**: AI-powered spending predictions by category
- **🔄 Budget Optimization**: Smart budget allocation recommendations
- **📅 Seasonal Analysis**: Historical spending pattern analysis

### 💻 **Modern UI/UX**
- **📱 Mobile-First Design**: Fully responsive across all devices
- **🎨 Modern Interface**: Glassmorphism design with smooth animations
- **🌈 Beautiful Gradients**: Eye-catching color schemes and visual effects
- **⚡ Fast Performance**: Optimized for speed and user experience

### 🔐 **Secure & Reliable**
- **🔒 User Authentication**: Secure login and signup system
- **💾 MongoDB Integration**: Reliable data storage and retrieval
- **🛡️ Data Protection**: Secure API endpoints and user data handling

## 🚀 Getting Started

### 🐳 **Docker Deployment (Recommended)**

The easiest way to run the application is using Docker containers. This setup includes Next.js frontend, Python ML API, and MongoDB database.

#### Prerequisites for Docker
- Docker Desktop installed
- Docker Compose installed

#### Quick Start with Docker

1. **Clone the repository**
```bash
git clone https://github.com/Nitesh-Kumar-Das/AI_money_management.git
cd ai-expense-tracker
git checkout docker-containerization
```

2. **Start all services with Docker Compose**
```bash
docker compose up -d
```

3. **Access the application**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Python ML API**: [http://localhost:8000](http://localhost:8000)
- **MongoDB**: `localhost:27017`

4. **Stop all services**
```bash
docker compose down
```

#### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| **Next.js Frontend** | 3000 | Main web application |
| **Python ML API** | 8000 | AI/ML backend for smart insights |
| **MongoDB** | 27017 | Database for user data and expenses |

### 💻 **Manual Development Setup**

If you prefer to run without Docker:

#### Prerequisites
- Node.js 18+ installed
- Python 3.12+ installed
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun package manager

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nitesh-Kumar-Das/AI_money_management.git
cd ai-expense-tracker
```

2. **Install Node.js dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ai-expense-tracker
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
AI_ML_API_URL=http://localhost:8000
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Start the Python ML API server**
```bash
python ai_budget_api_server.py
```

7. **Run the Next.js development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

8. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 How to Use

### 💰 Adding Expenses

**Method 1: Manual Entry**
1. Click "Add New" from the dashboard
2. Fill in expense details manually
3. Select category and save

**Method 2: OCR Scanning** 📸
1. Click "📸 Scan Receipt" on dashboard or add-expense page
2. Upload or drag-and-drop a receipt image
3. Wait for OCR processing (powered by Tesseract.js)
4. Review extracted data and accept/reject
5. Form auto-fills with extracted information

### 📊 Dashboard Features
- **Real-time Stats**: Total expenses, transaction count, average spending
- **Category Breakdown**: Visual representation of spending by category
- **Recent Expenses**: Quick view of latest transactions
- **AI Insights**: 3D analytics and spending recommendations

## 🛠️ Tech Stack

### 🐳 **Containerization**
- **Docker**: Multi-container deployment
- **Docker Compose**: Service orchestration
- **Alpine Linux**: Lightweight, secure base images
- **Multi-stage Builds**: Optimized image sizes

### Frontend
- **⚛️ Next.js 15**: React framework with App Router
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **📱 Responsive Design**: Mobile-first approach
- **🎭 TypeScript**: Type-safe development

### Backend
- **🔧 Next.js API Routes**: Serverless API endpoints
- **🐍 Python Flask**: ML API server for AI insights
- **🍃 MongoDB**: NoSQL database with Mongoose ODM
- **🔐 JWT**: JSON Web Token authentication
- **📧 Bcrypt**: Password hashing and security

### AI & Machine Learning
- **🤖 Python ML Models**: Random Forest Regressor for predictions
- **📊 NumPy & Pandas**: Data processing and analysis
- **🔍 Scikit-learn**: Machine learning algorithms
- **📈 Custom Analytics**: Spending pattern recognition
- **🎯 Anomaly Detection**: Outlier identification algorithms

### OCR & Text Processing
- **🔍 Tesseract.js**: Client-side OCR text recognition
- **🤖 Smart Categorization**: Keyword-based AI classification
- **📊 Data Analytics**: Custom algorithms for spending insights
- **🎯 Pattern Recognition**: Advanced regex for data extraction

### Development Tools
- **📝 ESLint**: Code linting and formatting
- **🔍 TypeScript**: Static type checking
- **🎨 PostCSS**: CSS processing and optimization

## 📁 Project Structure

```
ai-expense-tracker/
├── 🐳 Docker Files
│   ├── Dockerfile.nextjs       # Next.js container configuration
│   ├── Dockerfile.python       # Python ML API container
│   ├── docker-compose.yml      # Multi-container orchestration
│   ├── .dockerignore           # Docker build context optimization
│   ├── docker.env              # Container environment variables
│   ├── mongo-init.js           # MongoDB initialization script
│   └── nginx.conf              # Web server configuration
├── 🤖 AI/ML Backend
│   ├── ai_budget_api_server.py # Flask ML API server
│   ├── ai_budget_ml_model.py   # Machine learning models
│   └── requirements.txt        # Python dependencies
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── add-expense/       # Add expense page
│   │   ├── budgets/           # Budget management
│   │   └── api/               # API routes
│   │       └── ai-ml/         # AI/ML integration endpoints
│   ├── components/            # Reusable React components
│   │   ├── ReceiptScanner.tsx # OCR scanning component
│   │   ├── OCRResultsDisplay.tsx # OCR results review
│   │   ├── Modern3DAIInsights.tsx # AI analytics
│   │   └── Navbar.tsx         # Navigation component
│   ├── lib/                   # Utility libraries
│   │   ├── ocr-service.ts     # OCR processing logic
│   │   ├── ai-ml-service.ts   # ML API integration
│   │   ├── mongodb.ts         # Database connection
│   │   └── auth.ts            # Authentication utilities
│   ├── models/                # Database models
│   │   ├── User.ts            # User schema
│   │   ├── Expense.ts         # Expense schema
│   │   └── Budget.ts          # Budget schema
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## 🔧 OCR Implementation Details

### Supported Receipt Formats
- **Indian Currency**: ₹, Rs, INR formats
- **Date Formats**: dd/mm/yyyy, mm/dd/yyyy, dd-mm-yyyy, dd Mon yyyy
- **Receipt Types**: Restaurant, fuel, shopping, medical, transport receipts

### Extraction Patterns
```typescript
// Amount patterns
₹1,234.56 or Rs 1,234.56
Total: 1,234.56
Amount: ₹1,234.56
Grand Total: Rs 1,234.56

// Category classification
Food: restaurant, cafe, pizza, swiggy, zomato
Transport: uber, ola, taxi, fuel, petrol
Shopping: mall, store, amazon, flipkart
```

## 🚀 Deployment

### 🐳 **Docker Production Deployment**

#### Using Docker Compose (Recommended)
```bash
# Clone and switch to Docker branch
git clone https://github.com/Nitesh-Kumar-Das/AI_money_management.git
cd ai-expense-tracker
git checkout docker-containerization

# Production deployment
docker compose -f docker-compose.yml up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

#### Manual Docker Commands
```bash
# Build images
docker compose build

# Start services in detached mode
docker compose up -d

# Scale services if needed
docker compose up -d --scale python-ml-api=2

# Health check
curl http://localhost:3000/api/health
curl http://localhost:8000/health
```

### ☁️ **Free Hosting Services with Docker Support**

#### 🆓 **Railway** (Recommended for Full-Stack Apps)
Railway offers generous free tier with Docker support and database hosting.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from Docker Compose
railway up --service nextjs-frontend
railway up --service python-ml-api  
railway up --service mongodb

# Or deploy as a project
railway link
railway up
```

**Features:**
- $5 free credits monthly
- PostgreSQL/MongoDB databases included
- Automatic SSL certificates
- Custom domains support
- Environment variables management

#### 🆓 **Render** (Great for Docker Apps)
Render provides free Docker hosting with automatic deployments.

```bash
# Create render.yaml in your project root
# Connect GitHub repository to Render
# Automatic deployments on git push
```

**Features:**
- Free tier: 750 hours/month
- PostgreSQL database included
- SSL certificates
- Custom domains
- GitHub integration

#### 🆓 **Fly.io** (Docker-Native Platform)
Fly.io specializes in Docker deployments with global edge locations.

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login and initialize
fly auth login
fly launch

# Deploy
fly deploy
```

**Features:**
- 3 VMs free (256MB RAM each)
- Global deployment
- PostgreSQL included
- Custom domains
- Docker-first approach

#### 🆓 **Heroku** (Container Registry)
Deploy using Heroku's Container Registry.

```bash
# Install Heroku CLI and login
heroku login
heroku container:login

# Create apps for each service
heroku create your-app-frontend
heroku create your-app-ml-api

# Push and release containers
heroku container:push web -a your-app-frontend
heroku container:release web -a your-app-frontend
```

**Features:**
- 1000 free hours/month
- Add-ons ecosystem
- PostgreSQL included
- Easy scaling
- Custom domains

#### 🆓 **Google Cloud Run** (Serverless Containers)
Deploy containers with generous free tier.

```bash
# Install gcloud CLI
# Enable Cloud Run API
gcloud run deploy nextjs-app --source . --platform managed
gcloud run deploy python-ml-api --source . --platform managed
```

**Features:**
- 2 million requests/month free
- Pay-per-use pricing
- Automatic scaling
- Custom domains
- Cloud SQL integration

#### 🆓 **AWS ECS Fargate** (Free Tier)
Use AWS free tier for container hosting.

**Features:**
- 12 months free tier
- ECS + Fargate free usage
- RDS free tier for database
- Application Load Balancer

### 🔧 **Traditional Deployment**

#### Vercel (Frontend Only)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every commit

#### Manual Server Deployment
```bash
# Build Next.js application
npm run build
npm start

# Start Python ML API
python ai_budget_api_server.py

# Ensure MongoDB is running
mongod --dbpath /data/db
```

## 🆓 Free Hosting Deployment Guide

### 📋 **Step-by-Step Deployment**

#### 🚀 **Option 1: Railway (Recommended)**
Railway offers the best free tier for full-stack Docker applications.

1. **Prepare Your Repository**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin docker-containerization
   ```

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Deploy to Railway**
   ```bash
   railway init
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables:set NODE_ENV=production
   railway variables:set JWT_SECRET=$(openssl rand -base64 32)
   railway variables:set NEXTAUTH_SECRET=$(openssl rand -base64 32)
   ```

5. **Access Your App**
   - Frontend: `https://your-project.up.railway.app`
   - ML API: `https://your-ml-api.up.railway.app`

#### 🎯 **Option 2: Render**
Perfect for Docker-based applications with automatic deployments.

1. **Connect GitHub Repository**
   - Go to [Render.com](https://render.com)
   - Create account and connect GitHub
   - Select your repository

2. **Create Web Services**
   ```yaml
   # Use the provided render.yaml configuration
   # Services will be created automatically
   ```

3. **Configure Environment Variables**
   - Set in Render dashboard
   - Variables are automatically injected

4. **Deploy**
   - Automatic deployment on git push
   - View logs in Render dashboard

#### ⚡ **Option 3: Fly.io**
Docker-native platform with global edge locations.

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   fly auth login
   ```

2. **Deploy Frontend**
   ```bash
   fly launch --config fly.frontend.toml
   fly deploy --config fly.frontend.toml
   ```

3. **Deploy ML API**
   ```bash
   fly launch --config fly.ml-api.toml
   fly deploy --config fly.ml-api.toml
   ```

#### 🔧 **Option 4: Heroku**
Traditional platform with container support.

1. **Make Deploy Script Executable**
   ```bash
   chmod +x deploy-heroku.sh
   ./deploy-heroku.sh
   ```

2. **Manual Deployment**
   ```bash
   heroku container:push web -a your-app-name
   heroku container:release web -a your-app-name
   ```

### 💾 **Database Options for Free Hosting**

#### MongoDB Atlas (Recommended)
- **Free Tier**: 512MB storage
- **Global clusters**
- **Built-in security**
- **Easy integration**

```bash
# Get connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-expense-tracker
```

#### Railway PostgreSQL
- **Free with Railway**
- **Automatic backups**
- **Easy scaling**

#### ElephantSQL (PostgreSQL)
- **20MB free tier**
- **Reliable service**
- **Easy setup**

### 🔧 **Environment Variables Setup**

#### Required Variables:
```env
# Frontend
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
AI_ML_API_URL=your_ml_api_url
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret

# ML API
PORT=8000
FLASK_ENV=production
```

#### Generate Secrets:
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 📊 **Free Tier Comparison**

| Service | Frontend | ML API | Database | Custom Domain | SSL |
|---------|----------|--------|----------|---------------|-----|
| **Railway** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Render** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Fly.io** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Heroku** | ✅ | ✅ | Add-on | ✅ | ✅ |
| **Vercel** | ✅ | ❌ | ❌ | ✅ | ✅ |

### 🚀 **Deployment Tips**

1. **Use MongoDB Atlas** for database (free 512MB)
2. **Railway** offers best free tier for full-stack apps
3. **Render** has excellent Docker support
4. **Set up monitoring** with service health checks
5. **Use environment variables** for configuration
6. **Enable auto-deploy** from GitHub pushes

### 📈 **Scaling Considerations**

- **Free tiers** usually have usage limits
- **Monitor** your usage to avoid service interruptions
- **Consider paid tiers** as your app grows
- **Use CDN** for static assets
- **Implement caching** for better performance

## 🐳 Docker Commands

### Essential Docker Commands
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View service logs
docker compose logs -f [service-name]

# Rebuild specific service
docker compose build [service-name]

# Execute commands in running container
docker compose exec nextjs-app sh
docker compose exec python-ml-api bash
docker compose exec mongodb mongosh

# View service status
docker compose ps

# Remove all containers and volumes
docker compose down -v --remove-orphans
```

### Health Checks
```bash
# Frontend health check
curl http://localhost:3000/api/health

# ML API health check
curl http://localhost:8000/health

# MongoDB connection test
docker compose exec mongodb mongosh --eval "db.adminCommand('ismaster')"
```

## 🤖 AI/ML API Endpoints

The Python ML API server provides advanced AI insights:

### Core Endpoints
- `GET /health` - Service health status
- `GET /api/model-stats` - ML model information
- `POST /api/predict-spending` - Predict future spending
- `POST /api/detect-anomalies` - Identify unusual expenses
- `POST /api/budget-recommendations` - AI budget suggestions
- `POST /api/spending-trends` - Analyze spending patterns
- `POST /api/smart-insights` - Personalized financial insights
- `POST /api/category-predictions` - Category-wise predictions
- `POST /api/budget-optimization` - Optimize budget allocation
- `POST /api/seasonal-analysis` - Seasonal spending analysis
- `POST /api/retrain-model` - Update ML model with new data

### Example API Usage
```javascript
// Predict spending for a category
const response = await fetch('http://localhost:8000/api/predict-spending', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_income: 50000,
    user_age: 25,
    category: 'Food',
    month: 7
  })
});

// Get smart insights
const insights = await fetch('http://localhost:8000/api/smart-insights', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_data: { income: 50000, age: 25 },
    expenses: [...expenseHistory],
    budget_goals: { Food: 8000, Transport: 3000 }
  })
});
```
## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Docker** for containerization and deployment
- **Python Flask** for ML API backend
- **Random Forest Algorithm** for predictive analytics
- **Tesseract.js** for OCR functionality
- **Next.js** for the amazing React framework
- **MongoDB** for reliable data storage
- **Tailwind CSS** for beautiful styling
- **Vercel** for seamless deployment

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

**Made with ❤️ using Next.js, Docker, AI/ML, and OCR technology** �🤖✨
