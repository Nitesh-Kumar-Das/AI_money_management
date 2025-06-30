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

### 🤖 **AI Insights**
- **📊 Smart Analytics**: 3D visualizations and spending pattern analysis
- **🔮 Predictive Budgeting**: AI-powered budget recommendations
- **📈 Trend Analysis**: Monthly spending trends and category breakdowns
- **⚡ Real-time Insights**: Dynamic dashboard with personalized recommendations

### 💻 **Modern UI/UX**
- **📱 Mobile-First Design**: Fully responsive across all devices
- **🎨 Modern Interface**: Glassmorphism design with smooth animations
- **🌈 Beautiful Gradients**: Eye-catching color schemes and visual effects
- **⚡ Fast Performance**: Optimized for speed and user experience

### 🔐 **Secure & Reliable**
- **🔒 User Authentication**: Secure login and signup system
- **💾 MongoDB Integration**: Reliable data storage and retrieval
- **🛡️ Data Protection**: Secure API endpoints and user data handling


## PICS:
![image](https://github.com/user-attachments/assets/d95ac3b8-7554-4edf-a928-0c60626b2fda)
![image](https://github.com/user-attachments/assets/e4c2302b-6f69-4ae1-885d-80e8c5aa56f2)
![image](https://github.com/user-attachments/assets/6f8cb0bc-e8e4-43cd-b4f6-0d0497c3a486)
![image](https://github.com/user-attachments/assets/cf2ae109-bcf4-40b1-9cda-42322c1b8c16)
![image](https://github.com/user-attachments/assets/4344d5a6-a328-4764-b248-24a1bbbd402d)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-expense-tracker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
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

### Frontend
- **⚛️ Next.js 15**: React framework with App Router
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **📱 Responsive Design**: Mobile-first approach
- **🎭 TypeScript**: Type-safe development

### Backend
- **🔧 Next.js API Routes**: Serverless API endpoints
- **🍃 MongoDB**: NoSQL database with Mongoose ODM
- **🔐 JWT**: JSON Web Token authentication
- **📧 Bcrypt**: Password hashing and security

### AI & OCR
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
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── add-expense/       # Add expense page
│   │   ├── budgets/           # Budget management
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── ReceiptScanner.tsx # OCR scanning component
│   │   ├── OCRResultsDisplay.tsx # OCR results review
│   │   ├── Modern3DAIInsights.tsx # AI analytics
│   │   └── Navbar.tsx         # Navigation component
│   ├── lib/                   # Utility libraries
│   │   ├── ocr-service.ts     # OCR processing logic
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is opensourced to all

## 🙏 Acknowledgments

- **Tesseract.js** for OCR functionality
- **Next.js** for the amazing React framework
- **MongoDB** for reliable data storage
- **Tailwind CSS** for beautiful styling

## 📞 Support

If you have any questions or need help, please open an issue or contact me.

---

**Made with ❤️ using Next.js, AI, and OCR technology** 🚀✨
