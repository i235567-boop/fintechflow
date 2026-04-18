const express = require('express');
const router = express.Router();

// In-memory storage
let wallet = {
  balance: 10000,
  currency: 'PKR',
  owner: 'User'
};

let transactions = [];
let transactionIdCounter = 1;

// Helper function to create a transaction
function createTransaction(type, amount, description) {
  const transaction = {
    id: transactionIdCounter++,
    type: type,
    amount: amount,
    timestamp: new Date().toISOString(),
    description: description
  };
  transactions.unshift(transaction); // Add to beginning (newest first)
  return transaction;
}

// GET /api/wallet - Get wallet balance
router.get('/wallet', (req, res) => {
  res.status(200).json(wallet);
});

// POST /api/wallet/deposit - Deposit money
router.post('/wallet/deposit', (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  wallet.balance += amount;
  createTransaction('credit', amount, 'Deposit to wallet');
  
  res.status(200).json({ 
    message: 'Deposit successful',
    balance: wallet.balance 
  });
});

// POST /api/wallet/withdraw - Withdraw money
router.post('/wallet/withdraw', (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than 0' });
  }
  
  if (wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  wallet.balance -= amount;
  createTransaction('debit', amount, 'Withdrawal from wallet');
  
  res.status(200).json({ 
    message: 'Withdrawal successful',
    balance: wallet.balance 
  });
});

// GET /api/transactions - Get all transactions
router.get('/transactions', (req, res) => {
  const { type } = req.query;
  
  let filteredTransactions = transactions;
  
  if (type === 'credit' || type === 'debit') {
    filteredTransactions = transactions.filter(t => t.type === type);
  }
  
  res.status(200).json(filteredTransactions);
});

module.exports = router;
