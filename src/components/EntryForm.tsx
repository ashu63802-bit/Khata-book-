import React, { useState } from 'react';
import { generateId, getTodayDate } from '../utils/helpers';
import useStore from '../store/useStore';
import { Entry } from '../types/store';

interface EntryFormProps {
  partyId: string;
  onClose: () => void;
  onSuccess?: () => void;
  editingEntry?: Entry | null;
}

const EntryForm: React.FC<EntryFormProps> = ({
  partyId,
  onClose,
  onSuccess,
  editingEntry,
}) => {
  const [formData, setFormData] = useState<Partial<Entry>>({
    date: editingEntry?.date || getTodayDate(),
    time: editingEntry?.time || '',
    side: editingEntry?.side || 'income',
    amount: editingEntry?.amount || 0,
    note: editingEntry?.note || '',
  });
  const [error, setError] = useState<string>('');
  const addEntry = useStore((state) => state.addEntry);
  const updateEntry = useStore((state) => state.updateEntry);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.date) {
      setError('Date is required');
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      if (editingEntry) {
        updateEntry(editingEntry.id, formData);
      } else {
        const newEntry: Entry = {
          id: generateId(),
          partyId,
          date: formData.date,
          time: formData.time || undefined,
          side: formData.side as 'income' | 'expense',
          amount: formData.amount,
          note: formData.note || '',
          createdAt: Date.now(),
        };
        addEntry(newEntry);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to save entry');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          {editingEntry ? '✏️ Edit Entry' : '➕ Add New Entry'}
        </div>
        
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.side || 'income'}
              onChange={(e) =>
                setFormData({ ...formData, side: e.target.value as 'income' | 'expense' })
              }
            >
              <option value="income">💰 Income</option>
              <option value="expense">💸 Expense</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={formData.time || ''}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Amount (₹) *</label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Note</label>
            <textarea
              value={formData.note || ''}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Add description"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEntry ? 'Update' : 'Add'} Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
