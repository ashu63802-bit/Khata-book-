import React, { useState } from 'react';
import useStore from '../store/useStore';
import {
  exportAndDownloadJSON,
  exportAndDownloadCSV,
  exportAndDownloadHTML,
} from '../utils/export';

interface ExportModalProps {
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const parties = useStore((state) => state.parties);
  const entries = useStore((state) => state.entries);

  const handleExport = async (format: 'json' | 'csv' | 'html') => {
    try {
      setExporting(true);
      setMessage(null);

      switch (format) {
        case 'json':
          exportAndDownloadJSON(parties, entries);
          break;
        case 'csv':
          exportAndDownloadCSV(parties, entries);
          break;
        case 'html':
          exportAndDownloadHTML(parties, entries);
          break;
      }

      setMessage({
        type: 'success',
        text: `✅ Export as ${format.toUpperCase()} successful!`,
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to export data',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">📥 Export Data</div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#f5f5f5',
          borderRadius: '6px',
          color: '#666',
          fontSize: '14px'
        }}>
          <p><strong>Data to Export:</strong></p>
          <p>• Parties: {parties.length}</p>
          <p>• Entries: {entries.length}</p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            📄 Export as JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            📊 Export as CSV
          </button>
          <button
            onClick={() => handleExport('html')}
            disabled={exporting}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            📑 Export as HTML Report
          </button>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
