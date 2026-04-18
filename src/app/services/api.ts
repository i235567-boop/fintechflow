// Backend API URL - change this to your deployed backend URL
const API_BASE_URL = 'https://fintechflow-backend.onrender.com/api';

// Wallet API calls
export async function getWallet() {
  const response = await fetch(`${API_BASE_URL}/wallet`);
  return response.json();
}

export async function depositMoney(amount: number) {
  const response = await fetch(`${API_BASE_URL}/wallet/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  return response.json();
}

export async function withdrawMoney(amount: number) {
  const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  return response.json();
}

// Transaction API calls
export async function getTransactions(type?: string) {
  const url = type
    ? `${API_BASE_URL}/transactions?type=${type}`
    : `${API_BASE_URL}/transactions`;
  const response = await fetch(url);
  return response.json();
}

// Loan API calls
export async function applyForLoan(loanData: {
  applicant: string;
  amount: number;
  purpose: string;
  tenure: number;
}) {
  const response = await fetch(`${API_BASE_URL}/loans/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loanData)
  });
  return response.json();
}

export async function getAllLoans() {
  const response = await fetch(`${API_BASE_URL}/loans`);
  return response.json();
}

export async function updateLoanStatus(id: number, status: string) {
  const response = await fetch(`${API_BASE_URL}/loans/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return response.json();
}

// EMI Calculator API call
export async function calculateEMI(principal: number, annualRate: number, months: number) {
  const response = await fetch(
    `${API_BASE_URL}/emi-calculator?principal=${principal}&annualRate=${annualRate}&months=${months}`
  );
  return response.json();
}
