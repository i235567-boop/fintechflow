import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { WalletDashboard } from './pages/WalletDashboard';
import { TransactionHistory } from './pages/TransactionHistory';
import { LoanApplication } from './pages/LoanApplication';
import { LoanStatusViewer } from './pages/LoanStatusViewer';
import { EMICalculator } from './pages/EMICalculator';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<WalletDashboard />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                <Route path="/apply-loan" element={<LoanApplication />} />
                <Route path="/loan-status" element={<LoanStatusViewer />} />
                <Route path="/emi-calculator" element={<EMICalculator />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}