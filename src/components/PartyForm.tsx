import React, { useState } from 'react';
import { generateId } from '../utils/helpers';
import useStore from '../store/useStore';
import { Party } from '../types/store';

interface PartyFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  editingParty?: Party | null;
}

const PartyForm: React.FC<PartyFormProps> = ({ onClose, onSuccess, editingParty }) => {
  const [formData, setFormData] = useState<Partial<Party>>({
    name: editingParty?.name || '',
    phone: editingParty?.phone || '',
    notes: editingParty?.notes || '',
  });
  const [error, setError] = useState<string>('');
  const addParty = useStore((state) => state.addParty);
  const updateParty = useStore((state) => state.updateParty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name?.trim()) {
      setError('Party name is required');
      return;
    }

    try {
      if (editingParty) {
        updateParty(editingParty.id, formData);
      } else {
        const newParty: Party = {
          id: generateId(),
          name: formData.name,
          phone: formData.phone || undefined,
          notes: formData.notes || undefined,
          createdAt: Date.now(),
        };
        addParty(newParty);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to save party');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          {editingParty ? '✏️ Edit Party' : '➕ Add New Party'}
        </div>
        
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Party Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter party name"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any notes about this party"
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingParty ? 'Update' : 'Add'} Party
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartyForm;
