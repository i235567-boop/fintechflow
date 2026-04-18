import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';

interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  timestamp: string;
  description: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search and type
    let filtered = transactions;

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, typeFilter]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      showToast('Failed to fetch transactions', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Calculate summary stats
  const totalCredits = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalCredits - totalDebits;

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-card" style={{ height: '100px' }}></div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="skeleton-card transaction-skeleton"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Transaction History</h1>

      <div className="summary-bar">
        <div className="summary-item">
          <div className="summary-label">Total Credits</div>
          <div className="summary-value credit">{formatPKR(totalCredits)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Debits</div>
          <div className="summary-value debit">{formatPKR(totalDebits)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Net Balance</div>
          <div className="summary-value">{formatPKR(netBalance)}</div>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          <button
            onClick={() => setTypeFilter('all')}
            className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('credit')}
            className={`filter-btn ${typeFilter === 'credit' ? 'active' : ''}`}
          >
            Credits
          </button>
          <button
            onClick={() => setTypeFilter('debit')}
            className={`filter-btn ${typeFilter === 'debit' ? 'active' : ''}`}
          >
            Debits
          </button>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <div className="empty-state">No transactions found</div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="transaction-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="transaction-icon">
                {transaction.type === 'credit' ? '↑' : '↓'}
              </div>
              <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-time">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'credit' ? '+' : '-'}
                {formatPKR(transaction.amount)}
              </div>
              <span className={`transaction-badge ${transaction.type}`}>
                {transaction.type}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
