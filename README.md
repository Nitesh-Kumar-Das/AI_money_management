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
