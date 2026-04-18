import React, { useState, useEffect } from 'react';
import { getAllLoans, updateLoanStatus } from '../services/api';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';
import { useCountUp } from '../hooks/useCountUp';

interface Loan {
  id: number;
  applicant: string;
  amount: number;
  purpose: string;
  tenure: number;
  status: string;
  appliedAt: string;
}

export function LoanStatusViewer() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      setLoading(true);
      const data = await getAllLoans();
      setLoans(data);
    } catch (error) {
      showToast('Failed to fetch loans', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: number, status: string) {
    try {
      const result = await updateLoanStatus(id, status);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        // Update the loan in state
        setLoans(loans.map(loan =>
          loan.id === id ? { ...loan, status } : loan
        ));
        showToast(`Loan ${status} successfully!`, 'success');
      }
    } catch (error) {
      showToast('Failed to update loan status', 'error');
    }
  }

  // Sort loans
  const sortedLoans = [...loans].sort((a, b) => {
    if (sortBy === 'amount-high') {
      return b.amount - a.amount;
    } else if (sortBy === 'amount-low') {
      return a.amount - b.amount;
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0; // default date order
  });

  // Calculate counts
  const pendingCount = loans.filter(l => l.status === 'pending').length;
  const approvedCount = loans.filter(l => l.status === 'approved').length;
  const rejectedCount = loans.filter(l => l.status === 'rejected').length;

  const animatedPending = useCountUp(pendingCount, 1000);
  const animatedApproved = useCountUp(approvedCount, 1000);
  const animatedRejected = useCountUp(rejectedCount, 1000);

  if (loading) {
    return (
      <div className="page-container">
        <div className="skeleton-card" style={{ height: '100px' }}></div>
        <div className="loans-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card" style={{ height: '250px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Loan Status Viewer</h1>

      <div className="summary-bar">
        <div className="summary-item">
          <div className="summary-label">Pending</div>
          <div className="summary-value pending">{animatedPending}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Approved</div>
          <div className="summary-value approved">{animatedApproved}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Rejected</div>
          <div className="summary-value rejected">{animatedRejected}</div>
        </div>
      </div>

      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
          <option value="date">Date</option>
          <option value="amount-high">Amount (High to Low)</option>
          <option value="amount-low">Amount (Low to High)</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="loans-grid">
        {sortedLoans.length === 0 ? (
          <div className="empty-state">No loan applications found</div>
        ) : (
          sortedLoans.map((loan) => (
            <div key={loan.id} className="loan-card-wrapper">
              <div className="loan-card">
                <div className="loan-card-front">
                  <div className="loan-card-header">
                    <span className={`status-badge ${loan.status} ${loan.status === 'pending' ? 'pulse-glow' : ''}`}>
                      {loan.status}
                    </span>
                    <span className="loan-id">#{loan.id}</span>
                  </div>
                  <h3 className="loan-applicant">{loan.applicant}</h3>
                  <div className="loan-amount">{formatPKR(loan.amount)}</div>
                  <div className="loan-details">
                    <div className="loan-detail-item">
                      <span className="detail-label">Purpose:</span>
                      <span className="detail-value">{loan.purpose}</span>
                    </div>
                    <div className="loan-detail-item">
                      <span className="detail-label">Tenure:</span>
                      <span className="detail-value">{loan.tenure} months</span>
                    </div>
                  </div>
                  <div className="hover-hint">Hover to manage</div>
                </div>

                <div className="loan-card-back">
                  <h3 className="back-title">Update Status</h3>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleStatusUpdate(loan.id, 'approved')}
                      className="btn btn-approve"
                      disabled={loan.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(loan.id, 'rejected')}
                      className="btn btn-reject"
                      disabled={loan.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
