import React, { useRef, useState } from 'react';
import useStore from '../store/useStore';
import { importFromJSON } from '../utils/export';

interface ImportModalProps {
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setData = useStore((state) => state.setData);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importFromJSON(content);

        if (result.success) {
          const data = JSON.parse(content);
          setData(data.parties, data.entries);
          setMessage({
            type: 'success',
            text: `✅ Imported ${result.partiesImported} parties and ${result.entriesImported} entries!`,
          });

          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setMessage({
            type: 'error',
            text: `❌ ${result.error}`,
          });
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to import file',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">📤 Import Data</div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div style={{
          padding: '30px',
          border: '2px dashed #667eea',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.background = '#f0f0f0';
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files.length > 0) {
              const input = fileInputRef.current;
              if (input) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(files[0]);
                input.files = dataTransfer.files;
                handleFileSelect({ target: input } as any);
              }
            }
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📁</div>
          <p style={{ marginBottom: '10px', fontWeight: '600' }}>
            Drop your JSON file here or click to browse
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Only JSON files exported from Khata Book are supported
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div style={{
          padding: '15px',
          background: '#f9f9f9',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666',
          marginBottom: '20px'
        }}>
          <p><strong>⚠️ Important:</strong></p>
          <p>• This will merge the imported data with existing data</p>
          <p>• Make sure you trust the file source</p>
          <p>• Duplicate IDs may cause issues</p>
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

export default ImportModal;
