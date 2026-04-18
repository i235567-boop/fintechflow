const express = require('express');
const cors = require('cors');
const walletRouter = require('./routes/wallet');
const loansRouter = require('./routes/loans');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', walletRouter);
app.use('/api', loansRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
