# FintechFlow - Personal Finance & Loan Manager

A full-stack web application for managing personal finances, digital wallet operations, loan applications, and EMI calculations. Built with React, Node.js/Express, and deployed as a complete solution.

## Project Description

FintechFlow is a comprehensive personal finance management system that allows users to:
- Manage a digital wallet with deposit and withdrawal operations
- Track all financial transactions with filtering capabilities
- Apply for micro-loans with a multi-step application process
- View and manage loan applications with status updates
- Calculate EMI (Equated Monthly Installment) with detailed amortization schedules

## Features

### Frontend (React.js)
- **5 Main Pages:**
  1. Wallet Dashboard - Animated balance counter with deposit/withdraw forms
  2. Transaction History - Filterable list with staggered card animations
  3. Loan Application - 3-step multi-step form with validation
  4. Loan Status Viewer - Grid of loan cards with flip animations
  5. EMI Calculator - Server-computed EMI with amortization table

- **Advanced Features:**
  - Dark/Light theme toggle with localStorage persistence
  - Custom useCountUp hook for animated number counting
  - Toast notification system (no external library)
  - Loading skeleton screens for better UX
  - Responsive design (mobile, tablet, desktop)
  - PKR currency formatting utility
  - React Router v6 for navigation

### Backend (Node.js/Express)
- **8 RESTful API Endpoints:**
  - `GET /api/wallet` - Get wallet balance
  - `POST /api/wallet/deposit` - Deposit money
  - `POST /api/wallet/withdraw` - Withdraw money
  - `GET /api/transactions` - Get all transactions (supports ?type= filter)
  - `POST /api/loans/apply` - Apply for a loan
  - `GET /api/loans` - Get all loan applications
  - `PATCH /api/loans/:id/status` - Update loan status
  - `GET /api/emi-calculator` - Calculate EMI (query params: principal, annualRate, months)

- **Backend Features:**
  - Express Router structure for organized code
  - In-memory storage (no database required)
  - Automatic transaction logging
  - Server-side EMI calculation using the proper formula
  - Comprehensive input validation
  - Proper HTTP status codes and error handling

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React.js (with Vite) | Functional components + Hooks only |
| Backend | Node.js + Express.js | RESTful API with Express Router |
| HTTP Client | fetch() | All API calls from React |
| Styling | Custom CSS | Responsive layout, no CSS frameworks |
| Storage | In-memory (JS arrays/objects) | No database |
| Routing | React Router v6 | BrowserRouter with Routes |

## How to Run Locally

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root folder (or stay in root):
```bash
cd ..
```

2. Install dependencies:
```bash
pnpm install
```

3. Update the API URL in `src/app/services/api.ts` if needed:
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

4. Start the development server:
```bash
pnpm dev
```

The frontend will run on `http://localhost:5173` (or similar)

## API Endpoints Reference

### Wallet & Transaction Endpoints

| Method | Endpoint | Description | Request Body | Status |
|--------|----------|-------------|--------------|--------|
| GET | `/api/wallet` | Returns wallet object: `{ balance, currency: 'PKR', owner }` | None | 200 |
| POST | `/api/wallet/deposit` | Adds amount to balance. Rejects if amount ≤ 0 | `{ amount: 5000 }` | 200/400 |
| POST | `/api/wallet/withdraw` | Deducts amount. Rejects if insufficient balance | `{ amount: 1200 }` | 200/400 |
| GET | `/api/transactions` | Returns all transactions, newest-first. Supports `?type=credit` or `?type=debit` | None | 200 |

### Loan Management & EMI Endpoints

| Method | Endpoint | Description | Request Body | Status |
|--------|----------|-------------|--------------|--------|
| POST | `/api/loans/apply` | Apply for a loan. Validates all fields | `{ applicant, amount, purpose, tenure }` | 201/400 |
| GET | `/api/loans` | Returns all loan applications | None | 200 |
| PATCH | `/api/loans/:id/status` | Updates loan status to 'approved' or 'rejected' | `{ status: 'approved' }` | 200/400/404 |
| GET | `/api/emi-calculator` | Computes EMI server-side | Query: `?principal=100000&annualRate=12&months=12` | 200/400 |

## Project Structure

```
fintechflow/
├── backend/
│   ├── routes/
│   │   ├── wallet.js          # Wallet & transaction routes
│   │   └── loans.js           # Loan & EMI routes
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── README.md
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── Navbar.tsx     # Navigation component
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx    # Dark/Light theme
│   │   │   └── ToastContext.tsx    # Toast notifications
│   │   ├── hooks/
│   │   │   └── useCountUp.ts       # Custom count-up animation
│   │   ├── pages/
│   │   │   ├── WalletDashboard.tsx
│   │   │   ├── TransactionHistory.tsx
│   │   │   ├── LoanApplication.tsx
│   │   │   ├── LoanStatusViewer.tsx
│   │   │   └── EMICalculator.tsx
│   │   ├── services/
│   │   │   └── api.ts         # API service layer
│   │   ├── utils/
│   │   │   └── formatPKR.ts   # PKR formatting utility
│   │   └── App.tsx            # Main app component
│   └── styles/
│       └── index.css          # All custom styles
├── package.json
└── README.md
```

## Key Validations

### Loan Application
- **CNIC Format:** Must match `XXXXX-XXXXXXX-X` pattern
- **Amount:** Between PKR 5,000 and PKR 5,000,000
- **Tenure:** Between 3 and 60 months
- **Purpose:** Must select from: Business, Education, Medical, Personal

### Wallet Operations
- **Deposit/Withdraw:** Amount must be greater than 0
- **Withdraw:** Must have sufficient balance

### EMI Calculator
- **All Values:** Must be greater than 0
- **Formula:** EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ – 1]
  - Where: r = annualRate / 100 / 12, n = months

## Animation Features

1. **Balance Counter:** Count-up animation using custom hook
2. **Transaction Cards:** Staggered slide-in animation (100ms delay between cards)
3. **Loan Cards:** 3D flip animation on hover
4. **Toast Notifications:** Slide-in from top-right
5. **Skeleton Loaders:** Pulsing animation during data fetch
6. **Theme Transitions:** Smooth 0.3s color transitions
7. **Progress Bar:** Animated step indicators in loan form
8. **EMI Results:** Count-up animation for all stat cards
9. **Amortization Table:** Fade-in animation for rows

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `/` (or wherever package.json is)
4. Deploy

### Backend (Render / Railway)
1. Push code to GitHub
2. Create new Web Service in Render/Railway
3. Set root directory to `/backend`
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Post-Deployment
Update `src/app/services/api.ts` with your deployed backend URL:
```typescript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

## Student Information

**Name:** Sumyyah Saeed  
**Roll Number:** 23I-5567  
**Project:** FintechFlow - Full Stack Personal Finance Manager  
**Course:** Web Programming - BS Fintech

## Submission Links

**GitHub Repository URL:** https://github.com/i235567-boop/fintechflow  
**Frontend Live URL:** https://fintechflow-mukt.vercel.app/  
**Backend Live URL:** https://fintechflow-backend.onrender.com

## License

This project is created for educational purposes as part of a web programming quiz.

## Screenshots

[Add screenshots of your application here after deployment]

1. <img width="940" height="693" alt="image" src="https://github.com/user-attachments/assets/8b53c196-1641-4946-980f-4832db7f6a82" />

2. Transaction History with filters
3. Multi-step Loan Application form
4. Loan Status cards with flip animation
5. EMI Calculator with amortization table
6. Dark mode demonstration

---

Built with ❤️ using React, Node.js, and Express.js
