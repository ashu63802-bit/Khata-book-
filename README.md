# 📚 Khata Book - Personal Accounting Application

A modern, responsive web application for managing personal accounts, expenses, and income with export/import functionality.

## ✨ Features

- **Party Management**: Add, edit, and delete parties (clients, vendors, etc.)
- **Entry Tracking**: Log income and expense entries with dates, times, and notes
- **Balance Calculation**: View individual party balances and overall financial summaries
- **Data Export**: Export data in multiple formats:
  - JSON (with metadata)
  - CSV (for spreadsheet applications)
  - HTML (printable reports)
- **Data Import**: Import previously exported JSON data
- **Persistent Storage**: All data is saved to localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean and intuitive interface with real-time calculations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Khata-book-

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open in your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── PartyList.tsx
│   ├── PartyDetail.tsx
│   ├── PartyForm.tsx
│   ├── EntryForm.tsx
│   ├── ExportModal.tsx
│   └── ImportModal.tsx
├── store/              # State management (Zustand)
│   └── useStore.ts
├── types/              # TypeScript type definitions
│   └── store.ts
├── utils/              # Utility functions
│   ├── export.ts       # Export/import functionality
│   └── helpers.ts      # Helper functions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎯 Usage

### Adding a Party
1. Click "➕ Add Party" button
2. Fill in party name (required), phone number, and notes
3. Click "Add Party" to save

### Adding Entries
1. Select a party from the list
2. Click "➕ Add Entry" button
3. Choose type (Income/Expense)
4. Set date, time (optional), amount, and description
5. Click "Add Entry" to save

### Viewing Party Details
1. Click "View" button next to a party
2. See all entries and balance for that party
3. Edit or delete individual entries

### Exporting Data
1. Click "📥 Export" button in header
2. Choose format (JSON, CSV, or HTML)
3. File will be downloaded automatically

### Importing Data
1. Click "📤 Import" button in header
2. Select previously exported JSON file
3. Data will be merged with existing data

## 🛠 Technology Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Zustand**: Lightweight state management
- **LocalStorage**: Client-side data persistence

## 📊 Data Format

### Exported JSON Structure
```json
{
  "version": "1.0",
  "exportDate": "2024-01-01T10:30:00.000Z",
  "parties": [...],
  "entries": [...],
  "summary": {
    "partiesCount": 5,
    "entriesCount": 50,
    "totalIncome": 10000,
    "totalExpense": 5000
  }
}
```

## 🎨 Features Details

### Summary Dashboard
Displays:
- Total Income across all parties
- Total Expenses across all parties
- Net Balance (Income - Expenses)

### Party Balance
Calculated automatically as:
- Sum of all income entries - Sum of all expense entries
- Color-coded: Green for positive, Red for negative

### Entry Management
Each entry contains:
- Date (required)
- Time (optional)
- Type (Income/Expense)
- Amount (required)
- Description/Notes

## 💾 Storage

All data is stored in browser's localStorage under:
- `khata_parties`: Party information
- `khata_entries`: Transaction entries

⚠️ **Note**: Data persists only in the same browser. Clearing browser data will delete all entries.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Support

For issues and feature requests, please create an issue in the repository.

---

Made with ❤️ for personal accounting
