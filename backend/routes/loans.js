const express = require('express');
const router = express.Router();

// In-memory storage for loans
let loans = [];
let loanIdCounter = 1;

// POST /api/loans/apply - Apply for a loan
router.post('/loans/apply', (req, res) => {
  const { applicant, amount, purpose, tenure } = req.body;
  
  // Validate all fields
  if (!applicant || !amount || !purpose || !tenure) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (amount < 5000 || amount > 5000000) {
    return res.status(400).json({ error: 'Amount must be between PKR 5,000 and PKR 5,000,000' });
  }
  
  if (tenure < 3 || tenure > 60) {
    return res.status(400).json({ error: 'Tenure must be between 3 and 60 months' });
  }
  
  // Create new loan application
  const loan = {
    id: loanIdCounter++,
    applicant: applicant,
    amount: amount,
    purpose: purpose,
    tenure: tenure,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };
  
  loans.push(loan);
  
  res.status(201).json({ 
    message: 'Loan application submitted successfully',
    loan: loan 
  });
});

// GET /api/loans - Get all loans
router.get('/loans', (req, res) => {
  res.status(200).json(loans);
});

// PATCH /api/loans/:id/status - Update loan status
router.patch('/loans/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Validate status
  if (!status || (status !== 'approved' && status !== 'rejected')) {
    return res.status(400).json({ error: 'Status must be either approved or rejected' });
  }
  
  // Find loan
  const loan = loans.find(l => l.id === parseInt(id));
  
  if (!loan) {
    return res.status(404).json({ error: 'Loan not found' });
  }
  
  // Update status
  loan.status = status;
  
  res.status(200).json({ 
    message: `Loan ${status} successfully`,
    loan: loan 
  });
});

// GET /api/emi-calculator - Calculate EMI
router.get('/emi-calculator', (req, res) => {
  const principal = parseFloat(req.query.principal);
  const annualRate = parseFloat(req.query.annualRate);
  const months = parseInt(req.query.months);
  
  // Validate inputs
  if (!principal || !annualRate || !months) {
    return res.status(400).json({ error: 'Please provide principal, annualRate, and months' });
  }
  
  if (principal <= 0 || annualRate <= 0 || months <= 0) {
    return res.status(400).json({ error: 'All values must be greater than 0' });
  }
  
  // Calculate EMI using the formula: EMI = [P × r × (1+r)^n] / [(1+r)^n – 1]
  const monthlyRate = annualRate / 100 / 12; // r = annualRate / 100 / 12
  const n = months;
  
  let emi;
  
  if (monthlyRate === 0) {
    // If rate is 0, EMI is just principal divided by months
    emi = principal / months;
  } else {
    const onePlusR = 1 + monthlyRate;
    const onePlusRPowerN = Math.pow(onePlusR, n);
    emi = (principal * monthlyRate * onePlusRPowerN) / (onePlusRPowerN - 1);
  }
  
  const totalPayable = emi * months;
  const totalInterest = totalPayable - principal;
  
  res.status(200).json({
    emi: Math.round(emi * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100
  });
});

module.exports = router;
