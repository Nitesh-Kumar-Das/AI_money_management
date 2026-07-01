# AI-Powered Expense Tracker with OCR

A modern, intelligent expense tracking application built with Next.js that leverages AI-driven insights and OCR technology to automatically extract expense data from receipt images.

---

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [OCR Implementation Details](#ocr-implementation-details)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

### OCR Receipt Scanning

- **Smart Receipt Scanning** — Upload receipt images and automatically extract expense details.
- **Amount Detection** — Recognizes Indian currency formats (INR, Rs, INR).
- **Category Classification** — AI-powered categorization based on merchant keywords.
- **Date Extraction** — Supports multiple date formats (dd/mm/yyyy, mm/dd/yyyy, etc.).
- **Description Parsing** — Extracts merchant names and transaction descriptions.
- **Confidence Scoring** — Provides accuracy metrics for extracted data.

### AI Insights

- **Smart Analytics** — 3D visualizations and spending pattern analysis.
- **Predictive Budgeting** — AI-powered budget recommendations.
- **Trend Analysis** — Monthly spending trends and category breakdowns.
- **Real-time Insights** — Dynamic dashboard with personalized recommendations.

### Modern UI/UX

- **Mobile-First Design** — Fully responsive across all devices.
- **Glassmorphism Interface** — Modern design with smooth animations.
- **Rich Visuals** — Curated color schemes and gradient effects.
- **Optimized Performance** — Built for speed and a seamless user experience.

### Security and Reliability

- **User Authentication** — Secure login and signup system with JWT.
- **MongoDB Integration** — Reliable data storage and retrieval.
- **Data Protection** — Secure API endpoints and user data handling.

---

## Screenshots

![Dashboard Overview](https://github.com/user-attachments/assets/d95ac3b8-7554-4edf-a928-0c60626b2fda)

![Expense Tracking](https://github.com/user-attachments/assets/e4c2302b-6f69-4ae1-885d-80e8c5aa56f2)

![Receipt Scanner](https://github.com/user-attachments/assets/6f8cb0bc-e8e4-43cd-b4f6-0d0497c3a486)

![AI Insights](https://github.com/user-attachments/assets/cf2ae109-bcf4-40b1-9cda-42322c1b8c16)

![Budget Management](https://github.com/user-attachments/assets/4344d5a6-a328-4764-b248-24a1bbbd402d)

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB instance (local or cloud-hosted)
- Bun runtime and package manager installed

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Nitesh-Kumar-Das/AI_money_management.git
   cd AI_money_management
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

5. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

### Adding Expenses

**Manual Entry**

1. Click "Add New" from the dashboard.
2. Fill in the expense details.
3. Select a category and save.

**OCR Scanning**

1. Click "Scan Receipt" on the dashboard or the add-expense page.
2. Upload or drag-and-drop a receipt image.
3. Wait for OCR processing (powered by Tesseract.js).
4. Review the extracted data and accept or reject.
5. The form auto-fills with the extracted information.

### Dashboard

- **Real-time Stats** — Total expenses, transaction count, and average spending.
- **Category Breakdown** — Visual representation of spending by category.
- **Recent Expenses** — Quick view of the latest transactions.
- **AI Insights** — 3D analytics and spending recommendations.

---

## Tech Stack

### Frontend

| Technology    | Purpose                              |
|---------------|--------------------------------------|
| Next.js 15    | React framework with App Router      |
| Tailwind CSS  | Utility-first CSS framework          |
| TypeScript    | Type-safe development                |
| Framer Motion | Animations and transitions           |
| Recharts      | Data visualization and charting      |

### Backend

| Technology       | Purpose                           |
|------------------|-----------------------------------|
| Next.js API Routes | Serverless API endpoints        |
| MongoDB          | NoSQL database with Mongoose ODM  |
| JWT              | JSON Web Token authentication     |
| bcrypt.js        | Password hashing and security     |

### AI and OCR

| Technology    | Purpose                                |
|---------------|----------------------------------------|
| Tesseract.js  | Client-side OCR text recognition       |
| Custom ML     | Keyword-based AI classification        |
| Python (Flask)| ML model API server for budget insights|

---

## Project Structure

```
AI_money_management/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── auth/                   # Authentication pages
│   │   ├── dashboard/              # Main dashboard
│   │   ├── add-expense/            # Add expense page
│   │   ├── budgets/                # Budget management
│   │   ├── welcome/                # Welcome/onboarding page
│   │   ├── about/                  # About page
│   │   └── api/                    # API routes
│   │       ├── auth/               # Login and signup endpoints
│   │       ├── expenses/           # CRUD for expenses
│   │       └── budgets/            # Budget and AI suggestion endpoints
│   ├── components/                 # Reusable React components
│   │   ├── ReceiptScanner.tsx      # OCR scanning component
│   │   ├── OCRResultsDisplay.tsx   # OCR results review
│   │   ├── Modern3DAIInsights.tsx  # AI analytics visualization
│   │   ├── BudgetCharts.tsx        # Budget chart components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   └── NavbarWrapper.tsx       # Navbar wrapper
│   ├── lib/                        # Utility libraries
│   │   ├── ocr-service.ts          # OCR processing logic
│   │   ├── ai-ml-service.ts        # AI/ML service layer
│   │   ├── ai-budget-service.ts    # Budget AI service
│   │   ├── mongodb.ts              # Database connection
│   │   ├── auth.ts                 # Authentication utilities
│   │   └── validations.ts          # Input validation
│   ├── models/                     # Mongoose database models
│   │   ├── User.ts                 # User schema
│   │   ├── Expense.ts              # Expense schema
│   │   ├── Budget.ts               # Budget schema
│   │   └── Category.ts             # Category schema
│   ├── types/                      # TypeScript type definitions
│   └── styles/                     # Global stylesheets
├── ai_budget_api_server.py         # Python ML API server
├── ai_budget_ml_model.py           # ML model training script
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies and scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## OCR Implementation Details

### Supported Receipt Formats

| Format Type     | Supported Values                                |
|-----------------|------------------------------------------------|
| Currency        | INR (Indian Rupee), Rs, INR symbol              |
| Date Formats    | dd/mm/yyyy, mm/dd/yyyy, dd-mm-yyyy, dd Mon yyyy |
| Receipt Types   | Restaurant, fuel, shopping, medical, transport  |

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request.

---

## License

This project is open source and available to all.

---

## Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) — OCR text recognition
- [Next.js](https://nextjs.org/) — React framework
- [MongoDB](https://www.mongodb.com/) — Database
- [Tailwind CSS](https://tailwindcss.com/) — CSS framework
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Recharts](https://recharts.org/) — Charting library

---

## Support

If you have any questions or need help, please [open an issue](https://github.com/Nitesh-Kumar-Das/AI_money_management/issues).

---

Built with Next.js, AI, and OCR technology.
