import React, { useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { formatPKR } from '../utils/formatPKR';
import { getWallet, depositMoney, withdrawMoney } from '../services/api';
import { useToast } from '../context/ToastContext';

export function WalletDashboard() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [animateBalance, setAnimateBalance] = useState(false);

  const { showToast } = useToast();
  const animatedBalance = useCountUp(balance, 1000);

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    try {
      setLoading(true);
      const data = await getWallet();
      setBalance(data.balance);
    } catch (error) {
      showToast('Failed to fetch wallet balance', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (!amount || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      const result = await depositMoney(amount);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        setBalance(result.balance);
        setAnimateBalance(true);
        setTimeout(() => setAnimateBalance(false), 500);
        showToast('Deposit successful!', 'success');
        setDepositAmount('');
      }
    } catch (error) {
      showToast('Deposit failed', 'error');
    }
  }

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      const result = await withdrawMoney(amount);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        setBalance(result.balance);
        setAnimateBalance(true);
        setTimeout(() => setAnimateBalance(false), 500);
        showToast('Withdrawal successful!', 'success');
        setWithdrawAmount('');
      }
    } catch (error) {
      showToast('Withdrawal failed', 'error');
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-card" style={{ height: '200px' }}></div>
        <div className="forms-container">
          <div className="skeleton-card" style={{ height: '250px' }}></div>
          <div className="skeleton-card" style={{ height: '250px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Wallet Dashboard</h1>

      <div className={`balance-card ${animateBalance ? 'pulse' : ''}`}>
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">{formatPKR(animatedBalance)}</div>
      </div>

      <div className="forms-container">
        <form onSubmit={handleDeposit} className="transaction-form">
          <h2 className="form-title">Deposit Money</h2>
          <div className="form-group">
            <label htmlFor="deposit-amount">Amount (PKR)</label>
            <input
              id="deposit-amount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Enter amount"
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Deposit
          </button>
        </form>

        <form onSubmit={handleWithdraw} className="transaction-form">
          <h2 className="form-title">Withdraw Money</h2>
          <div className="form-group">
            <label htmlFor="withdraw-amount">Amount (PKR)</label>
            <input
              id="withdraw-amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
}
