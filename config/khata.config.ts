/**
 * Configuration for Khata Book application
 */

export const khataConfig = {
  // Storage configuration
  storage: {
    partyKey: "khata.parties",
    entryKey: "khata.entries",
    backupKey: "khata.backup",
  },

  // Validation rules
  validation: {
    party: {
      nameMinLength: 2,
      nameMaxLength: 100,
      phonePattern: /^[6-9]\d{9}$/,
    },
    entry: {
      noteMinLength: 1,
      noteMaxLength: 500,
      amountMin: 0.01,
      amountMax: 99999999,
    },
  },

  // Feature flags
  features: {
    enableBackup: true,
    enableDuplicateDetection: true,
    enableErrorLogging: true,
    enableAutoCleanup: true,
  },

  // Error messages
  errors: {
    VALIDATION_ERROR: "Input validation failed",
    STORAGE_ERROR: "Storage operation failed",
    QUOTA_EXCEEDED: "Storage quota exceeded",
    PARSE_ERROR: "Failed to parse data",
    CORRUPT_DATA: "Data corruption detected",
    NOT_FOUND: "Data not found",
    OPERATION_FAILED: "Operation failed",
  },

  // Success messages
  messages: {
    partyAdded: "Party added successfully",
    partyUpdated: "Party updated successfully",
    partyDeleted: "Party deleted successfully",
    entryAdded: "Entry added successfully",
    entryUpdated: "Entry updated successfully",
    entryDeleted: "Entry deleted successfully",
    dataExported: "Data exported successfully",
    dataImported: "Data imported successfully",
    dataRestored: "Data restored successfully",
  },

  // UI/Theme configuration
  theme: {
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      success: "#11998e",
      danger: "#eb3349",
      warning: "#f45c43",
      info: "#667eea",
    },
  },

  // Date/Time configuration
  dateTime: {
    locale: "en-IN",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "HH:MM",
    displayFormat: "DD/MM/YYYY",
  },

  // Currency configuration
  currency: {
    symbol: "₹",
    locale: "en-IN",
    decimals: 2,
  },

  // Backup configuration
  backup: {
    enableAutoBackup: true,
    backupBeforeWrite: true,
    maxBackupSize: 5, // Keep last 5 backups
  },
};

export default khataConfig;
