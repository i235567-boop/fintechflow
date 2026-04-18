# FintechFlow - Quick Start Guide

## Get Started in 3 Steps

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000`

**Keep this terminal running!**

### Step 2: Start the Frontend (in a new terminal)

```bash
# From the root directory
pnpm install
pnpm dev
```

The frontend will run on `http://localhost:5173`

### Step 3: Open Your Browser

Navigate to `http://localhost:5173` and start using FintechFlow!

## What You Can Do

1. **Wallet Dashboard** - Deposit and withdraw money, see animated balance
2. **Transactions** - View all your transactions with filters
3. **Apply Loan** - Fill out a 3-step form to apply for a loan
4. **Loan Status** - View and manage loan applications (hover cards to approve/reject)
5. **EMI Calculator** - Calculate loan EMI with detailed amortization

## Toggle Dark Mode

Click the theme toggle button (🌙/☀️) in the navbar to switch between light and dark modes!

## Testing the App

### Test Wallet Operations
1. Go to Wallet Dashboard
2. Try depositing PKR 5,000
3. Try withdrawing PKR 2,000
4. Watch the balance animate!

### Test Loan Application
1. Go to Apply Loan
2. Fill in your details (CNIC format: 12345-1234567-1)
3. Amount: between 5,000 - 5,000,000
4. Tenure: between 3 - 60 months
5. Submit and get your loan ID!

### Test EMI Calculator
1. Go to EMI Calculator
2. Enter Principal: 100000
3. Annual Rate: 12
4. Tenure: 12 months
5. Click Calculate and see the amortization table!

## Common Issues

### Backend not starting?
- Make sure you're in the `backend` folder
- Run `npm install` first
- Check if port 5000 is free

### Frontend not connecting to backend?
- Make sure backend is running on port 5000
- Check `src/app/services/api.ts` has the correct URL
- CORS is already configured in backend

### API calls failing?
- Open browser console (F12) to see errors
- Verify backend is running
- Check network tab for failed requests

## Code Structure

```
📁 backend/
  └── routes/
      ├── wallet.js  (wallet & transactions)
      └── loans.js   (loans & EMI)
  └── server.js

📁 src/app/
  ├── pages/         (5 main pages)
  ├── components/    (Navbar)
  ├── context/       (Theme, Toast)
  ├── hooks/         (useCountUp)
  ├── services/      (API calls)
  └── utils/         (formatPKR)
```

## Next Steps

1. **Test all features** thoroughly
2. **Deploy** to Vercel (frontend) and Render (backend)
3. **Update** API_BASE_URL in `src/app/services/api.ts` with deployed backend URL
4. **Push** to GitHub as a public repository
5. **Submit** both GitHub and live URLs

## Need Help?

- Check the main README.md for detailed documentation
- All code is beginner-friendly with simple logic
- Every function has a clear purpose
- No complex patterns or advanced techniques used

Happy coding! 🚀
