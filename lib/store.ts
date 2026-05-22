/**
 * Enhanced Khata Book Store with validation, error handling, and backup
 */

import { useSyncExternalStore } from "react";
import { validatePartyInput, validateEntryInput } from "./validation";
import { KhataErrorManager, safeStorageGet, safeStorageSet } from "./errors";
import { khataConfig } from "../config/khata.config";

export type Party = {
  id: string;
  name: string;
  phone?: string;
  createdAt: number;
};

export type EntrySide = "income" | "expense";

export type Entry = {
  id: string;
  partyId: string;
  date: string; // YYYY-MM-DD
  side: EntrySide;
  time?: string;
  note: string;
  amount: number;
  createdAt: number;
};

export type BackupData = {
  parties: Party[];
  entries: Entry[];
  timestamp: number;
};

const PARTY_KEY = khataConfig.storage.partyKey;
const ENTRY_KEY = khataConfig.storage.entryKey;
const BACKUP_KEY = khataConfig.storage.backupKey;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const isBrowser = () => typeof window !== "undefined";

const read = <T>(key: string): T[] => {
  return safeStorageGet<T>(key, []);
};

const write = <T>(key: string, val: T[]) => {
  if (!isBrowser()) return;
  
  // Create backup before write
  if (khataConfig.backup.backupBeforeWrite && key === ENTRY_KEY) {
    const currentParties = read<Party>(PARTY_KEY);
    const currentEntries = read<Entry>(ENTRY_KEY);
    khata.createBackup();
  }

  const success = safeStorageSet(key, val);
  if (success) {
    emit();
  } else {
    KhataErrorManager.error("WRITE_FAILED", `Failed to write to ${key}`);
  }
};

const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const khata = {
  // Parties
  listParties(): Party[] {
    return read<Party>(PARTY_KEY).sort((a, b) => b.createdAt - a.createdAt);
  },

  getParty(id: string): Party | undefined {
    return read<Party>(PARTY_KEY).find((p) => p.id === id);
  },

  addParty(input: { name: string; phone?: string }): Party | null {
    const validation = validatePartyInput(input);
    if (!validation.success) {
      KhataErrorManager.warning("VALIDATION_ERROR", "Party validation failed", {
        errors: validation.errors,
      });
      return null;
    }

    const party: Party = {
      id: uid(),
      name: validation.data.name,
      phone: validation.data.phone,
      createdAt: Date.now(),
    };

    write(PARTY_KEY, [...read<Party>(PARTY_KEY), party]);
    KhataErrorManager.info("PARTY_ADDED", "Party added successfully", { partyId: party.id });
    return party;
  },

  updateParty(id: string, input: { name?: string; phone?: string }): Party | null {
    const party = this.getParty(id);
    if (!party) {
      KhataErrorManager.warning("NOT_FOUND", "Party not found", { partyId: id });
      return null;
    }

    const validation = validatePartyInput({
      name: input.name ?? party.name,
      phone: input.phone ?? party.phone,
    });

    if (!validation.success) {
      KhataErrorManager.warning("VALIDATION_ERROR", "Party validation failed", {
        errors: validation.errors,
      });
      return null;
    }

    const updated: Party = {
      ...party,
      name: validation.data.name,
      phone: validation.data.phone,
    };

    write(
      PARTY_KEY,
      read<Party>(PARTY_KEY).map((p) => (p.id === id ? updated : p))
    );
    return updated;
  },

  deleteParty(id: string) {
    write(
      PARTY_KEY,
      read<Party>(PARTY_KEY).filter((p) => p.id !== id)
    );
    write(
      ENTRY_KEY,
      read<Entry>(ENTRY_KEY).filter((e) => e.partyId !== id)
    );
    KhataErrorManager.info("PARTY_DELETED", "Party deleted successfully", { partyId: id });
  },

  // Entries
  listEntries(partyId: string): Entry[] {
    const entries = read<Entry>(ENTRY_KEY);
    if (!partyId) return entries;
    return entries.filter((e) => e.partyId === partyId);
  },

  entriesFor(partyId: string, date: string): Entry[] {
    return read<Entry>(ENTRY_KEY)
      .filter((e) => e.partyId === partyId && e.date === date)
      .sort((a, b) => a.createdAt - b.createdAt);
  },

  addEntry(input: Omit<Entry, "id" | "createdAt">): Entry | null {
    const validation = validateEntryInput(input);
    if (!validation.success) {
      KhataErrorManager.warning("VALIDATION_ERROR", "Entry validation failed", {
        errors: validation.errors,
      });
      return null;
    }

    const entry: Entry = {
      ...validation.data,
      id: uid(),
      createdAt: Date.now(),
    };

    write(ENTRY_KEY, [...read<Entry>(ENTRY_KEY), entry]);
    KhataErrorManager.info("ENTRY_ADDED", "Entry added successfully", { entryId: entry.id });
    return entry;
  },

  updateEntry(id: string, patch: Partial<Omit<Entry, "id">>): Entry | null {
    const entries = read<Entry>(ENTRY_KEY);
    const entry = entries.find((e) => e.id === id);

    if (!entry) {
      KhataErrorManager.warning("NOT_FOUND", "Entry not found", { entryId: id });
      return null;
    }

    const updated = { ...entry, ...patch };
    const validation = validateEntryInput(updated);

    if (!validation.success) {
      KhataErrorManager.warning("VALIDATION_ERROR", "Entry validation failed", {
        errors: validation.errors,
      });
      return null;
    }

    write(
      ENTRY_KEY,
      entries.map((e) => (e.id === id ? updated : e))
    );
    return updated;
  },

  deleteEntry(id: string) {
    write(
      ENTRY_KEY,
      read<Entry>(ENTRY_KEY).filter((e) => e.id !== id)
    );
    KhataErrorManager.info("ENTRY_DELETED", "Entry deleted successfully", { entryId: id });
  },

  // Totals
  balanceOf(partyId: string): { income: number; expense: number; net: number } {
    const entries = read<Entry>(ENTRY_KEY).filter((e) => e.partyId === partyId);
    const income = entries
      .filter((e) => e.side === "income")
      .reduce((s, e) => s + e.amount, 0);
    const expense = entries
      .filter((e) => e.side === "expense")
      .reduce((s, e) => s + e.amount, 0);
    return { income, expense, net: income - expense };
  },

  // Statistics
  getStatistics() {
    const parties = read<Party>(PARTY_KEY);
    const entries = read<Entry>(ENTRY_KEY);

    const totalIncome = entries
      .filter((e) => e.side === "income")
      .reduce((s, e) => s + e.amount, 0);

    const totalExpense = entries
      .filter((e) => e.side === "expense")
      .reduce((s, e) => s + e.amount, 0);

    return {
      totalParties: parties.length,
      totalEntries: entries.length,
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  },

  // Data Management
  validateData() {
    const parties = read<Party>(PARTY_KEY);
    const entries = read<Entry>(ENTRY_KEY);

    const issues: string[] = [];

    // Check for orphaned entries
    entries.forEach((entry) => {
      if (!parties.find((p) => p.id === entry.partyId)) {
        issues.push(`Orphaned entry: ${entry.id} refers to non-existent party`);
      }
    });

    return { valid: issues.length === 0, issues };
  },

  cleanOrphanedEntries() {
    const parties = read<Party>(PARTY_KEY);
    const entries = read<Entry>(ENTRY_KEY);

    const cleaned = entries.filter((entry) =>
      parties.find((p) => p.id === entry.partyId)
    );

    if (cleaned.length < entries.length) {
      write(ENTRY_KEY, cleaned);
      KhataErrorManager.info(
        "DATA_CLEANED",
        "Orphaned entries removed",
        { removed: entries.length - cleaned.length }
      );
    }
  },

  // Backup & Restore
  createBackup(): BackupData | null {
    const parties = read<Party>(PARTY_KEY);
    const entries = read<Entry>(ENTRY_KEY);

    const backup: BackupData = {
      parties,
      entries,
      timestamp: Date.now(),
    };

    try {
      if (isBrowser()) {
        window.localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
        KhataErrorManager.info("BACKUP_CREATED", "Backup created successfully");
        return backup;
      }
    } catch (err) {
      KhataErrorManager.error("BACKUP_FAILED", "Failed to create backup", err);
    }

    return null;
  },

  restoreBackup(): boolean {
    try {
      if (!isBrowser()) return false;

      const backupStr = window.localStorage.getItem(BACKUP_KEY);
      if (!backupStr) {
        KhataErrorManager.warning("NO_BACKUP", "No backup found");
        return false;
      }

      const backup = JSON.parse(backupStr) as BackupData;

      write(PARTY_KEY, backup.parties);
      write(ENTRY_KEY, backup.entries);

      KhataErrorManager.info("BACKUP_RESTORED", "Backup restored successfully", {
        timestamp: backup.timestamp,
      });
      return true;
    } catch (err) {
      KhataErrorManager.error("RESTORE_FAILED", "Failed to restore backup", err);
      return false;
    }
  },
};

// React hook: re-render on any change
export function useKhata<T>(selector: () => T): T {
  return useSyncExternalStore(
    subscribe,
    selector,
    selector // SSR fallback uses same selector (will be empty arrays)
  );
}

// Helpers
export const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const formatINR = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN").format(n);

const HINDI_WEEKDAYS = [
  "रविवार",
  "सोमवार",
  "मंगलवार",
  "बुधवार",
  "गुरुवार",
  "शुक्रवार",
  "शनिवार",
];
const HINDI_MONTHS = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितंबर",
  "अक्टूबर",
  "नवंबर",
  "दिसंबर",
];

export function formatDateHindi(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${HINDI_WEEKDAYS[date.getDay()]}, ${d} ${HINDI_MONTHS[m - 1]} ${y}`;
}

export function formatDateEnglish(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function shiftDate(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, "0");
  const nd = String(date.getDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}
