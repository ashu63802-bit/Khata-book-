# 📚 Khata Book - Personal Accounting Application

A modern, full-featured personal accounting and ledger management application built with React, TypeScript, and TailwindCSS. Designed specifically for managing income and expense transactions with support for multiple parties.

## 🌟 Features

### Core Features
- ✅ **Party Management** - Create, update, and manage multiple creditors/debtors
- ✅ **Transaction Recording** - Add income and expense entries with detailed information
- ✅ **Balance Tracking** - Real-time calculation of income, expense, and net balance
- ✅ **Search & Filter** - Advanced search with fuzzy matching and date range filtering
- ✅ **Data Export** - Export data in JSON, CSV, and HTML formats
- ✅ **Data Import** - Import previously exported data
- ✅ **Backup & Restore** - Automatic backups with restore functionality
- ✅ **Data Validation** - Comprehensive input validation and data integrity checks
- ✅ **Error Handling** - Centralized error management with logging
- ✅ **Internationalization** - Support for Hindi and English languages

### Advanced Features
- 🔐 **Type Safety** - Full TypeScript with strict type checking
- 🎨 **Modern UI** - React components with TailwindCSS styling
- 📊 **Statistics** - Detailed analytics and reporting
- 🔍 **Duplicate Detection** - Find potential duplicate party entries
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🧪 **Comprehensive Tests** - 50+ unit tests with Vitest

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ashu63802-bit/Khata-book-.git
cd Khata-book-

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm build
```

## 🚀 Quick Start

### 1. Add a Party (Creditor/Debtor)

```typescript
import { khata } from './lib/store';

const party = khata.addParty({
  name: "John Doe",
  phone: "9876543210"
});

console.log(party);
// {
//   id: "abc123xyz",
//   name: "John Doe",
//   phone: "9876543210",
//   createdAt: 1705315200000
// }
```

### 2. Record a Transaction

```typescript
import { khata } from './lib/store';

const entry = khata.addEntry({
  partyId: "abc123xyz",
  date: "2024-01-15",
  side: "income",      // or "expense"
  amount: 5000,
  note: "Payment received for services",
  time: "14:30"        // optional
});

console.log(entry);
// {
//   id: "entry001",
//   partyId: "abc123xyz",
//   date: "2024-01-15",
//   side: "income",
//   amount: 5000,
//   note: "Payment received for services",
//   time: "14:30",
//   createdAt: 1705315200000
// }
```

### 3. Get Balance Summary

```typescript
const balance = khata.balanceOf("abc123xyz");

console.log(balance);
// {
//   income: 50000,
//   expense: 15000,
//   net: 35000
// }
```

### 4. Search Parties

```typescript
import { searchParties } from './lib/search';

const parties = khata.listParties();
const results = searchParties(parties, "john");

results.forEach(result => {
  console.log(`${result.party.name} - Score: ${result.score}`);
});
```

### 5. Export Data

```typescript
import { 
  exportAndDownloadJSON,
  exportAndDownloadHTML,
  exportAndDownloadCSV 
} from './lib/export';

const parties = khata.listParties();
const entries = khata.listEntries("");

// Export as JSON
exportAndDownloadJSON(parties, entries);

// Export as HTML Report
exportAndDownloadHTML(parties, entries);

// Export as CSV
exportAndDownloadCSV(parties, entries);
```

## 📖 Component Usage

### Dashboard

```typescript
import { Dashboard } from './components/KhataComponents';

function App() {
  return <Dashboard />;
}
```

### Party List

```typescript
import { PartyList } from './components/KhataComponents';

function App() {
  return <PartyList />;
}
```

### Add Party Form

```typescript
import { AddPartyForm } from './components/KhataComponents';

function App() {
  return <AddPartyForm />;
}
```

### Party Details

```typescript
import { PartyDetails } from './components/KhataComponents';

function App() {
  return <PartyDetails partyId="party-id-here" />;
}
```

### Export Tools

```typescript
import { ExportTools } from './components/KhataComponents';

function App() {
  const parties = khata.listParties();
  const entries = khata.listEntries("");
  
  return <ExportTools parties={parties} entries={entries} />;
}
```

### Data Validator

```typescript
import { DataValidator } from './components/KhataComponents';

function App() {
  return <DataValidator />;
}
```

## 🔍 API Reference

### Store Operations

#### Parties

```typescript
// List all parties
khata.listParties(): Party[]

// Get specific party
khata.getParty(id: string): Party | undefined

// Add new party
khata.addParty(input: { name: string; phone?: string }): Party | null

// Update existing party
khata.updateParty(id: string, input: { name?: string; phone?: string }): Party | null

// Delete party and cascade delete entries
khata.deleteParty(id: string): void
```

#### Entries/Transactions

```typescript
// List entries for a party
khata.listEntries(partyId: string): Entry[]

// Get entries for specific date
khata.entriesFor(partyId: string, date: string): Entry[]

// Add new entry
khata.addEntry(input: Omit<Entry, "id" | "createdAt">): Entry | null

// Update entry
khata.updateEntry(id: string, patch: Partial<Omit<Entry, "id">>): Entry | null

// Delete entry
khata.deleteEntry(id: string): void
```

#### Analytics

```typescript
// Get balance for party
khata.balanceOf(partyId: string): { income, expense, net }

// Get overall statistics
khata.getStatistics(): {
  totalParties,
  totalEntries,
  totalIncome,
  totalExpense,
  netBalance
}
```

#### Data Management

```typescript
// Validate data integrity
khata.validateData(): DataValidation

// Clean orphaned entries
khata.cleanOrphanedEntries(): void

// Create backup
khata.createBackup(): BackupData

// Restore from backup
khata.restoreBackup(): boolean
```

### Search & Filter

```typescript
// Search parties
searchParties(parties: Party[], query: string, minSimilarity?: number)

// Search entries
searchEntries(entries: Entry[], query: string, minSimilarity?: number)

// Filter entries
filterEntries(entries: Entry[], options: FilterOptions): Entry[]

// Get entries by month
getEntriesByMonth(entries: Entry[], year: number, month: number): Entry[]

// Get entries by year
getEntriesByYear(entries: Entry[], year: number): Entry[]

// Calculate statistics
calculateEntryStatistics(entries: Entry[])

// Find duplicate parties
findDuplicateParties(parties: Party[], threshold?: number)
```

### Export Functions

```typescript
// Export to JSON
exportToJSON(parties: Party[], entries: Entry[]): string

// Export to CSV
exportToCSV(parties: Party[], entries: Entry[]): string

// Export to HTML
exportToHTML(parties: Party[], entries: Entry[]): string

// Import from JSON
importFromJSON(jsonString: string): ImportResult

// Download utilities
downloadFile(content: string, filename: string, mimeType?: string): void
exportAndDownloadJSON(parties: Party[], entries: Entry[], filename?: string): void
exportAndDownloadCSV(parties: Party[], entries: Entry[], filename?: string): void
exportAndDownloadHTML(parties: Party[], entries: Entry[], filename?: string): void
```

### Validation

```typescript
// Validate party input
validatePartyInput(input: any): ValidationResult<PartyInput>

// Validate entry input
validateEntryInput(input: any): ValidationResult<EntryInput>

// Utility validators
isValidPhoneNumber(phone: string): boolean
isValidAmount(amount: number): boolean
isValidTime(time: string): boolean
isValidISODate(date: string): boolean
```

### Error Handling

```typescript
// Subscribe to errors
KhataErrorManager.subscribe((error: KhataError) => {
  console.log(error);
});

// Log errors
KhataErrorManager.info(code, message, context?)
KhataErrorManager.warning(code, message, context?)
KhataErrorManager.error(code, message, context?)
KhataErrorManager.critical(code, message, context?)

// Get error log
KhataErrorManager.getLog(): KhataError[]

// Clear error log
KhataErrorManager.clearLog(): void
```

## 📊 Data Structures

### Party

```typescript
type Party = {
  id: string;              // Unique identifier (auto-generated)
  name: string;            // Party name (2-100 characters)
  phone?: string;          // Indian phone number (10 digits)
  createdAt: number;       // Timestamp of creation
};
```

### Entry

```typescript
type Entry = {
  id: string;              // Unique identifier (auto-generated)
  partyId: string;         // Reference to Party
  date: string;            // Date in YYYY-MM-DD format
  side: "income" | "expense";
  time?: string;           // Optional time in HH:MM format
  note: string;            // Transaction description (1-500 chars)
  amount: number;          // Transaction amount (positive)
  createdAt: number;       // Timestamp of creation
};
```

### Balance

```typescript
type Balance = {
  income: number;          // Total income for party
  expense: number;         // Total expense for party
  net: number;             // Income - Expense
};
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- ✅ Validation tests (party and entry validation)
- ✅ Store operations (add, update, delete)
- ✅ Balance calculations
- ✅ Search and filter operations
- ✅ Export/import functionality
- ✅ Data integrity checks

## 🎨 UI Components

The application includes ready-to-use React components:

- **Dashboard** - Overview with statistics
- **PartyList** - Browse and search parties
- **AddPartyForm** - Create new parties
- **PartyDetails** - View party transactions
- **AddEntryForm** - Record transactions
- **ExportTools** - Export data in multiple formats
- **DataValidator** - Check and fix data issues

All components are styled with TailwindCSS for a modern, responsive design.

## ⚙️ Configuration

Edit `config/khata.config.ts` to customize:

- Storage keys
- Validation rules
- Feature flags
- Error messages
- Theme colors
- Date/currency formats

## 🔐 Data Storage

- **Storage Method**: Browser localStorage
- **Backup**: Automatic backups created before each write
- **Format**: JSON serialization
- **Error Handling**: Graceful fallbacks on quota exceeded

## 🌐 Internationalization

Supported languages:
- 🇮🇳 **Hindi** - Date formatting with Hindi month/weekday names
- 🇬🇧 **English** - Indian locale date formatting
- 💰 **Currency** - Indian Rupee (₹) formatting

## 📝 Examples

### Complete Example: Track Payment from John

```typescript
import { khata, useKhata, formatINR } from './lib/store';

// 1. Add John as a party
const john = khata.addParty({
  name: "John Doe",
  phone: "9876543210"
});

// 2. Record an income transaction
khata.addEntry({
  partyId: john!.id,
  date: "2024-01-15",
  side: "income",
  amount: 5000,
  note: "Project payment received"
});

// 3. Record an expense transaction
khata.addEntry({
  partyId: john!.id,
  date: "2024-01-20",
  side: "expense",
  amount: 2000,
  note: "Material purchase"
});

// 4. Check balance
const balance = khata.balanceOf(john!.id);
console.log(`Balance: ${formatINR(balance.net)}`); // ₹3,000

// 5. List all transactions
const entries = khata.listEntries(john!.id);
entries.forEach(entry => {
  console.log(`${entry.date}: ${entry.side} - ${formatINR(entry.amount)}`);
});

// 6. Export data
import { exportAndDownloadJSON } from './lib/export';
exportAndDownloadJSON(khata.listParties(), entries);
```

## 🐛 Troubleshooting

### Storage Quota Exceeded
- Export and clear old data
- Use browser developer tools to clear localStorage
- The app automatically handles quota errors

### Validation Errors
- Check error messages in console
- Refer to validation rules in `lib/validation.ts`
- Use the DataValidator component to check data integrity

### Missing Data
- Use the backup/restore functionality
- Check browser console for error logs
- Run data validation to find issues

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

Built with ❤️ for personal accounting management.
