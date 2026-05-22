import type { Party, Entry } from '../types/store';

// Export to JSON with metadata
export const exportToJSON = (parties: Party[], entries: Entry[]): string => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    parties,
    entries,
    summary: {
      partiesCount: parties.length,
      entriesCount: entries.length,
      totalIncome: entries
        .filter((e) => e.side === 'income')
        .reduce((sum, e) => sum + e.amount, 0),
      totalExpense: entries
        .filter((e) => e.side === 'expense')
        .reduce((sum, e) => sum + e.amount, 0),
    },
  };

  return JSON.stringify(data, null, 2);
};

// Export to CSV
export const exportToCSV = (parties: Party[], entries: Entry[]): string => {
  const lines: string[] = [];

  // Parties section
  lines.push('PARTIES');
  lines.push('ID,Name,Phone,Created');
  parties.forEach((p) => {
    const phone = p.phone || '';
    const created = new Date(p.createdAt).toISOString();
    lines.push(`"${p.id}","${p.name}","${phone}","${created}"`);
  });

  lines.push('');
  lines.push('ENTRIES');
  lines.push('ID,Party ID,Date,Type,Time,Note,Amount,Created');

  entries.forEach((e) => {
    const time = e.time || '';
    const created = new Date(e.createdAt).toISOString();
    lines.push(
      `"${e.id}","${e.partyId}","${e.date}","${e.side}","${time}","${e.note.replace(
        /"/g,
        '""'
      )}",${e.amount},"${created}"`
    );
  });

  return lines.join('\n');
};

// Export to HTML report
export const exportToHTML = (parties: Party[], entries: Entry[]): string => {
  const totalIncome = entries
    .filter((e) => e.side === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries
    .filter((e) => e.side === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString('en-IN');

  const partiesHTML = parties
    .map(
      (p) => `
    <tr>
      <td class="border p-2">${p.name}</td>
      <td class="border p-2">${p.phone || '-'}</td>
      <td class="border p-2">${formatDate(p.createdAt)}</td>
    </tr>
  `
    )
    .join('');

  const entriesHTML = entries
    .map(
      (e) => `
    <tr>
      <td class="border p-2">${e.date}</td>
      <td class="border p-2">${e.time || '-'}</td>
      <td class="border p-2"><span class="px-2 py-1 rounded ${
        e.side === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }">${e.side}</span></td>
      <td class="border p-2">${e.note}</td>
      <td class="border p-2 text-right">${formatCurrency(e.amount)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khata Book Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; margin-bottom: 10px; }
    .export-date { color: #666; font-size: 14px; margin-bottom: 20px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
    .summary-card { padding: 20px; border-radius: 8px; background: #f9f9f9; border-left: 4px solid #667eea; }
    .summary-card h3 { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 10px; }
    .summary-card .amount { font-size: 24px; font-weight: bold; color: #333; }
    .summary-card.income { border-left-color: #11998e; }
    .summary-card.expense { border-left-color: #eb3349; }
    .summary-card.balance { border-left-color: #667eea; }
    h2 { color: #333; margin: 30px 0 15px; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
    td { padding: 10px 12px; border: 1px solid #eee; }
    tr:nth-child(even) { background: #f9f9f9; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
    @media print { body { background: white; } .container { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>📚 Khata Book Report</h1>
    <div class="export-date">Generated on ${new Date().toLocaleString('en-IN')}</div>
    
    <div class="summary">
      <div class="summary-card income">
        <h3>Total Income</h3>
        <div class="amount">${formatCurrency(totalIncome)}</div>
      </div>
      <div class="summary-card expense">
        <h3>Total Expense</h3>
        <div class="amount">${formatCurrency(totalExpense)}</div>
      </div>
      <div class="summary-card balance">
        <h3>Net Balance</h3>
        <div class="amount" style="color: ${netBalance >= 0 ? '#11998e' : '#eb3349'};">${formatCurrency(
    netBalance
  )}</div>
      </div>
    </div>

    <h2>Parties (${parties.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Date Added</th>
        </tr>
      </thead>
      <tbody>
        ${partiesHTML || "<tr><td colspan='3' style='text-align:center; color:#999;'>No parties found</td></tr>"}
      </tbody>
    </table>

    <h2>Entries (${entries.length})</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Type</th>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${entriesHTML || "<tr><td colspan='5' style='text-align:center; color:#999;'>No entries found</td></tr>"}
      </tbody>
    </table>

    <div class="footer">
      <p>This report was generated by Khata Book - Personal Accounting Application</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
};

// Import from JSON
export type ImportResult =
  | { success: true; partiesImported: number; entriesImported: number }
  | { success: false; error: string };

export const importFromJSON = (jsonString: string): ImportResult => {
  try {
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data.parties) || !Array.isArray(data.entries)) {
      return { success: false, error: 'Invalid JSON format' };
    }

    return {
      success: true,
      partiesImported: data.parties.length,
      entriesImported: data.entries.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to parse JSON',
    };
  }
};

// Download helper
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
) => {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export and download functions
export const exportAndDownloadJSON = (
  parties: Party[],
  entries: Entry[],
  filename: string = `khata-${new Date().toISOString().split('T')[0]}.json`
) => {
  const json = exportToJSON(parties, entries);
  downloadFile(json, filename, 'application/json');
};

export const exportAndDownloadCSV = (
  parties: Party[],
  entries: Entry[],
  filename: string = `khata-${new Date().toISOString().split('T')[0]}.csv`
) => {
  const csv = exportToCSV(parties, entries);
  downloadFile(csv, filename, 'text/csv');
};

export const exportAndDownloadHTML = (
  parties: Party[],
  entries: Entry[],
  filename: string = `khata-${new Date().toISOString().split('T')[0]}.html`
) => {
  const html = exportToHTML(parties, entries);
  downloadFile(html, filename, 'text/html');
};
