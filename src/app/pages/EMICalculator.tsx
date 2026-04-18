import React, { useState } from 'react';
import { calculateEMI } from '../services/api';
import { formatPKR } from '../utils/formatPKR';
import { useToast } from '../context/ToastContext';
import { useCountUp } from '../hooks/useCountUp';

interface EMIResult {
  emi: number;
  totalPayable: number;
  totalInterest: number;
}

interface AmortizationRow {
  month: number;
  principalComponent: number;
  interestComponent: number;
  remainingBalance: number;
}

export function EMICalculator() {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [result, setResult] = useState<EMIResult | null>(null);
  const [amortization, setAmortization] = useState<AmortizationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const animatedEMI = useCountUp(result?.emi || 0, 1000);
  const animatedTotal = useCountUp(result?.totalPayable || 0, 1000);
  const animatedInterest = useCountUp(result?.totalInterest || 0, 1000);

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();

    const p = parseFloat(principal);
    const r = parseFloat(annualRate);
    const t = parseInt(tenure);

    if (!p || !r || !t) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (p <= 0 || r <= 0 || t <= 0) {
      showToast('All values must be greater than 0', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await calculateEMI(p, r, t);

      if (data.error) {
        showToast(data.error, 'error');
        return;
      }

      setResult(data);

      // Calculate amortization schedule
      const schedule: AmortizationRow[] = [];
      let remainingBalance = p;
      const monthlyRate = r / 100 / 12;

      for (let month = 1; month <= t; month++) {
        const interestComponent = remainingBalance * monthlyRate;
        const principalComponent = data.emi - interestComponent;
        remainingBalance -= principalComponent;

        schedule.push({
          month,
          principalComponent,
          interestComponent,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }

      setAmortization(schedule);
    } catch (error) {
      showToast('Failed to calculate EMI', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Calculate proportion for visual bar
  const principalPercent = result
    ? ((parseFloat(principal) / result.totalPayable) * 100).toFixed(1)
    : 0;
  const interestPercent = result
    ? ((result.totalInterest / result.totalPayable) * 100).toFixed(1)
    : 0;

  return (
    <div className="page-container">
      <h1 className="page-title">EMI Calculator</h1>

      <form onSubmit={handleCalculate} className="emi-form">
        <div className="form-row">
          <div className="form-group">
            <label>Principal Amount (PKR)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="form-input"
              placeholder="100000"
            />
          </div>

          <div className="form-group">
            <label>Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="form-input"
              placeholder="12"
            />
          </div>

          <div className="form-group">
            <label>Tenure (Months)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="form-input"
              placeholder="12"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>
      </form>

      {result && (
        <>
          <div className="emi-results">
            <div className="result-card">
              <div className="result-label">Monthly EMI</div>
              <div className="result-value">{formatPKR(animatedEMI)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Total Payable</div>
              <div className="result-value">{formatPKR(animatedTotal)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">Total Interest</div>
              <div className="result-value">{formatPKR(animatedInterest)}</div>
            </div>
          </div>

          <div className="proportion-section">
            <h3 className="section-title">Principal vs Interest Breakdown</h3>
            <div className="proportion-bar">
              <div className="proportion-principal" style={{ width: `${principalPercent}%` }}>
                Principal ({principalPercent}%)
              </div>
              <div className="proportion-interest" style={{ width: `${interestPercent}%` }}>
                Interest ({interestPercent}%)
              </div>
            </div>
          </div>

          <div className="amortization-section">
            <h3 className="section-title">Amortization Schedule</h3>
            <div className="table-wrapper">
              <table className="amortization-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Principal Component</th>
                    <th>Interest Component</th>
                    <th>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortization.map((row, index) => (
                    <tr key={row.month} className="table-row" style={{ animationDelay: `${index * 20}ms` }}>
                      <td>{row.month}</td>
                      <td>{formatPKR(row.principalComponent)}</td>
                      <td>{formatPKR(row.interestComponent)}</td>
                      <td>{formatPKR(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
