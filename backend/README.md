# FintechFlow Backend API

Backend API for the FintechFlow personal finance management application.

## How to Run Locally

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Wallet & Transaction Endpoints

| Method | Endpoint URL | Description | Request Body | Status |
|--------|-------------|-------------|--------------|--------|
| GET | `/api/wallet` | Returns wallet object | None | 200 |
| POST | `/api/wallet/deposit` | Adds amount to balance | `{ amount: 5000 }` | 200/400 |
| POST | `/api/wallet/withdraw` | Deducts amount from balance | `{ amount: 1200 }` | 200/400 |
| GET | `/api/transactions` | Returns all transactions | None (query param optional) | 200 |

### Loan Management & EMI Endpoints

| Method | Endpoint URL | Description | Request Body | Status |
|--------|-------------|-------------|--------------|--------|
| POST | `/api/loans/apply` | Apply for a loan | `{ applicant, amount, purpose, tenure }` | 201/400 |
| GET | `/api/loans` | Get all loan applications | None | 200 |
| PATCH | `/api/loans/:id/status` | Update loan status | `{ status: 'approved' }` | 200/400/404 |
| GET | `/api/emi-calculator` | Calculate EMI | Query params: `?principal=100000&annualRate=12&months=12` | 200/400 |

## Storage

All data is stored in-memory using JavaScript arrays and objects. No database is used.
