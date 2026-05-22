import React, { useState } from 'react';
import useStore from '../store/useStore';
import { formatCurrency } from '../utils/helpers';
import PartyForm from './PartyForm';

interface PartyListProps {
  onSelectParty: (partyId: string) => void;
}

const PartyList: React.FC<PartyListProps> = ({ onSelectParty }) => {
  const [showForm, setShowForm] = useState(false);
  const parties = useStore((state) => state.parties);
  const deleteParty = useStore((state) => state.deleteParty);
  const getPartyBalance = useStore((state) => state.getPartyBalance);

  const handleDelete = (partyId: string) => {
    if (window.confirm('Are you sure you want to delete this party? All entries will also be deleted.')) {
      deleteParty(partyId);
    }
  };

  if (parties.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
          <h2>No Parties Yet</h2>
          <p>Create your first party to start tracking expenses and income</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            ➕ Add First Party
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2>👥 Parties ({parties.length})</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            ➕ Add Party
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th className="text-right">Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((party) => {
              const balance = getPartyBalance(party.id);
              return (
                <tr key={party.id}>
                  <td>
                    <strong>{party.name}</strong>
                    {party.notes && (
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {party.notes}
                      </div>
                    )}
                  </td>
                  <td>{party.phone || '-'}</td>
                  <td className="text-right">
                    <span className="currency" style={{
                      color: balance >= 0 ? '#11998e' : '#eb3349'
                    }}>
                      {formatCurrency(balance)}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => onSelectParty(party.id)}
                      className="btn btn-secondary"
                      style={{ marginRight: '10px' }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(party.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showForm && <PartyForm onClose={() => setShowForm(false)} />}
    </>
  );
};

export default PartyList;
