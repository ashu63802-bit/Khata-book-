import React, { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import EntryForm from './EntryForm';
import PartyForm from './PartyForm';

interface PartyDetailProps {
  partyId: string;
  onBack: () => void;
}

const PartyDetail: React.FC<PartyDetailProps> = ({ partyId, onBack }) => {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showPartyForm, setShowPartyForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any | null>(null);

  const party = useStore((state) => state.getPartyById(partyId));
  const entries = useStore((state) => state.getEntriesByParty(partyId));
  const deleteEntry = useStore((state) => state.deleteEntry);
  const getPartyBalance = useStore((state) => state.getPartyBalance);

  if (!party) {
    return <div>Party not found</div>;
  }

  const balance = getPartyBalance(partyId);
  const income = entries
    .filter((e) => e.side === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter((e) => e.side === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleDeleteEntry = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(entryId);
    }
  };

  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  return (
    <>
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <button onClick={onBack} className="btn btn-secondary">
              ← Back
            </button>
            <h2 style={{ marginTop: '15px' }}>{party.name}</h2>
            {party.phone && <p style={{ color: '#666' }}>📱 {party.phone}</p>}
            {party.notes && <p style={{ color: '#999', fontSize: '14px' }}>{party.notes}</p>}
          </div>
          <button
            onClick={() => setShowPartyForm(true)}
            className="btn btn-secondary"
          >
            ✏️ Edit
          </button>
        </div>

        <div className="summary-grid">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <div className="amount">{formatCurrency(income)}</div>
          </div>
          <div className="summary-card expense">
            <h3>Total Expense</h3>
            <div className="amount">{formatCurrency(expense)}</div>
          </div>
          <div className="summary-card balance">
            <h3>Balance</h3>
            <div className="amount" style={{
              color: balance >= 0 ? '#11998e' : '#eb3349'
            }}>{formatCurrency(balance)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>📝 Entries ({entries.length})</h2>
          <button
            onClick={() => {
              setEditingEntry(null);
              setShowEntryForm(true);
            }}
            className="btn btn-primary"
          >
            ➕ Add Entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="empty-state">
            <p>No entries yet. Add your first entry!</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Description</th>
                <th className="text-right">Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.time || '-'}</td>
                    <td>
                      <span className={`badge badge-${entry.side}`}>
                        {entry.side === 'income' ? '💰' : '💸'} {entry.side}
                      </span>
                    </td>
                    <td>{entry.note}</td>
                    <td className="text-right">
                      <span className="currency">{formatCurrency(entry.amount)}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="btn btn-secondary"
                        style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {showEntryForm && (
        <EntryForm
          partyId={partyId}
          onClose={() => {
            setShowEntryForm(false);
            setEditingEntry(null);
          }}
          editingEntry={editingEntry}
        />
      )}

      {showPartyForm && (
        <PartyForm
          editingParty={party}
          onClose={() => setShowPartyForm(false)}
        />
      )}
    </>
  );
};

export default PartyDetail;
