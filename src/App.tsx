import React, { useState } from 'react';
import Header from './components/Header';
import PartyList from './components/PartyList';
import PartyDetail from './components/PartyDetail';
import ExportModal from './components/ExportModal';
import ImportModal from './components/ImportModal';

function App() {
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="container">
        <Header
          onExport={() => setShowExportModal(true)}
          onImport={() => setShowImportModal(true)}
        />

        {selectedPartyId ? (
          <PartyDetail
            partyId={selectedPartyId}
            onBack={() => setSelectedPartyId(null)}
          />
        ) : (
          <PartyList onSelectParty={setSelectedPartyId} />
        )}

        {showExportModal && (
          <ExportModal onClose={() => setShowExportModal(false)} />
        )}

        {showImportModal && (
          <ImportModal onClose={() => setShowImportModal(false)} />
        )}
      </div>
    </div>
  );
}

export default App;
