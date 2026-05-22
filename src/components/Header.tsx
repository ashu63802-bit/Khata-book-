import React from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/helpers';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onImport }) => {
  const totalIncome = useStore((state) => state.getTotalIncome());
  const totalExpense = useStore((state) => state.getTotalExpense());
  const netBalance = useStore((state) => state.getNetBalance());

  return (
    <header style={{
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333'
        }}>📚 Khata Book</h1>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button onClick={onExport} className="btn btn-primary">📥 Export</button>
          <button onClick={onImport} className="btn btn-secondary">📤 Import</button>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card income">
          <h3>Total Income</h3>
          <div className="amount">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="summary-card expense">
          <h3>Total Expense</h3>
          <div className="amount">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="summary-card balance">
          <h3>Net Balance</h3>
          <div className="amount" style={{
            color: netBalance >= 0 ? '#11998e' : '#eb3349'
          }}>{formatCurrency(netBalance)}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
