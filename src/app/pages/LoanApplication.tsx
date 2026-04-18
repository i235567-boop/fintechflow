import React, { useState } from 'react';
import { applyForLoan } from '../services/api';
import { useToast } from '../context/ToastContext';

export function LoanApplication() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    applicant: '',
    cnic: '',
    contact: '',
    amount: '',
    purpose: '',
    tenure: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loanId, setLoanId] = useState<number | null>(null);

  const { showToast } = useToast();

  function validateStep1() {
    const newErrors: Record<string, string> = {};

    if (!formData.applicant.trim()) {
      newErrors.applicant = 'Applicant name is required';
    }

    // CNIC format: XXXXX-XXXXXXX-X
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!formData.cnic.match(cnicPattern)) {
      newErrors.cnic = 'CNIC must be in format: XXXXX-XXXXXXX-X';
    }

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateStep2() {
    const newErrors: Record<string, string> = {};
    const amount = parseFloat(formData.amount);
    const tenure = parseInt(formData.tenure);

    if (!amount || amount < 5000 || amount > 5000000) {
      newErrors.amount = 'Amount must be between PKR 5,000 and PKR 5,000,000';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Please select a purpose';
    }

    if (!tenure || tenure < 3 || tenure > 60) {
      newErrors.tenure = 'Tenure must be between 3 and 60 months';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  }

  function handleBack() {
    setStep(step - 1);
    setErrors({});
  }

  async function handleSubmit() {
    try {
      const result = await applyForLoan({
        applicant: formData.applicant,
        amount: parseFloat(formData.amount),
        purpose: formData.purpose,
        tenure: parseInt(formData.tenure)
      });

      if (result.error) {
        showToast(result.error, 'error');
      } else {
        setLoanId(result.loan.id);
        setSubmitted(true);
        showToast('Loan application submitted successfully!', 'success');
      }
    } catch (error) {
      showToast('Failed to submit loan application', 'error');
    }
  }

  if (submitted) {
    return (
      <div className="page-container">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Application Submitted!</h2>
          <p className="success-message">
            Your loan application has been received.
          </p>
          <div className="loan-id">
            Application ID: <strong>#{loanId}</strong>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                applicant: '',
                cnic: '',
                contact: '',
                amount: '',
                purpose: '',
                tenure: ''
              });
            }}
            className="btn btn-primary"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Loan Application</h1>

      <div className="progress-bar">
        <div className="progress-step">
          <div className={`progress-circle ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-label">Personal Info</div>
        </div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className="progress-step">
          <div className={`progress-circle ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-label">Loan Details</div>
        </div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className="progress-step">
          <div className={`progress-circle ${step >= 3 ? 'active' : ''}`}>3</div>
          <div className="progress-label">Review</div>
        </div>
      </div>

      <div className="loan-form">
        {step === 1 && (
          <div className="form-step">
            <h2 className="step-title">Step 1: Personal Information</h2>

            <div className="form-group">
              <label>Applicant Name</label>
              <input
                type="text"
                value={formData.applicant}
                onChange={(e) => setFormData({ ...formData, applicant: e.target.value })}
                className="form-input"
              />
              {errors.applicant && <div className="error-message">{errors.applicant}</div>}
            </div>

            <div className="form-group">
              <label>CNIC (XXXXX-XXXXXXX-X)</label>
              <input
                type="text"
                value={formData.cnic}
                onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                placeholder="12345-1234567-1"
                className="form-input"
              />
              {errors.cnic && <div className="error-message">{errors.cnic}</div>}
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="form-input"
              />
              {errors.contact && <div className="error-message">{errors.contact}</div>}
            </div>

            <button onClick={handleNext} className="btn btn-primary">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2 className="step-title">Step 2: Loan Details</h2>

            <div className="form-group">
              <label>Loan Amount (PKR)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="form-input"
              />
              {errors.amount && <div className="error-message">{errors.amount}</div>}
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="form-input"
              >
                <option value="">Select Purpose</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Medical">Medical</option>
                <option value="Personal">Personal</option>
              </select>
              {errors.purpose && <div className="error-message">{errors.purpose}</div>}
            </div>

            <div className="form-group">
              <label>Tenure (Months)</label>
              <input
                type="number"
                value={formData.tenure}
                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                className="form-input"
              />
              {errors.tenure && <div className="error-message">{errors.tenure}</div>}
            </div>

            <div className="form-buttons">
              <button onClick={handleBack} className="btn btn-secondary">
                Back
              </button>
              <button onClick={handleNext} className="btn btn-primary">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2 className="step-title">Step 3: Review & Submit</h2>

            <div className="review-section">
              <div className="review-item">
                <span className="review-label">Applicant Name:</span>
                <span className="review-value">{formData.applicant}</span>
              </div>
              <div className="review-item">
                <span className="review-label">CNIC:</span>
                <span className="review-value">{formData.cnic}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Contact:</span>
                <span className="review-value">{formData.contact}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Loan Amount:</span>
                <span className="review-value">PKR {parseFloat(formData.amount).toLocaleString()}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Purpose:</span>
                <span className="review-value">{formData.purpose}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Tenure:</span>
                <span className="review-value">{formData.tenure} months</span>
              </div>
            </div>

            <div className="form-buttons">
              <button onClick={handleBack} className="btn btn-secondary">
                Back
              </button>
              <button onClick={handleSubmit} className="btn btn-primary">
                Submit Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
