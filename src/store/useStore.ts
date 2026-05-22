import { create } from 'zustand';
import { Party, Entry } from '../types/store';

interface AppState {
  parties: Party[];
  entries: Entry[];
  addParty: (party: Party) => void;
  updateParty: (id: string, party: Partial<Party>) => void;
  deleteParty: (id: string) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, entry: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  getPartyById: (id: string) => Party | undefined;
  getEntriesByParty: (partyId: string) => Entry[];
  getPartyBalance: (partyId: string) => number;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getNetBalance: () => number;
  setData: (parties: Party[], entries: Entry[]) => void;
  clearAll: () => void;
}

const useStore = create<AppState>((set, get) => ({
  parties: (() => {
    try {
      const stored = localStorage.getItem('khata_parties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),
  
  entries: (() => {
    try {
      const stored = localStorage.getItem('khata_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),

  addParty: (party) => set((state) => {
    const newParties = [...state.parties, party];
    localStorage.setItem('khata_parties', JSON.stringify(newParties));
    return { parties: newParties };
  }),

  updateParty: (id, updates) => set((state) => {
    const newParties = state.parties.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    localStorage.setItem('khata_parties', JSON.stringify(newParties));
    return { parties: newParties };
  }),

  deleteParty: (id) => set((state) => {
    const newParties = state.parties.filter((p) => p.id !== id);
    const newEntries = state.entries.filter((e) => e.partyId !== id);
    localStorage.setItem('khata_parties', JSON.stringify(newParties));
    localStorage.setItem('khata_entries', JSON.stringify(newEntries));
    return { parties: newParties, entries: newEntries };
  }),

  addEntry: (entry) => set((state) => {
    const newEntries = [...state.entries, entry];
    localStorage.setItem('khata_entries', JSON.stringify(newEntries));
    return { entries: newEntries };
  }),

  updateEntry: (id, updates) => set((state) => {
    const newEntries = state.entries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    localStorage.setItem('khata_entries', JSON.stringify(newEntries));
    return { entries: newEntries };
  }),

  deleteEntry: (id) => set((state) => {
    const newEntries = state.entries.filter((e) => e.id !== id);
    localStorage.setItem('khata_entries', JSON.stringify(newEntries));
    return { entries: newEntries };
  }),

  getPartyById: (id) => {
    return get().parties.find((p) => p.id === id);
  },

  getEntriesByParty: (partyId) => {
    return get().entries.filter((e) => e.partyId === partyId);
  },

  getPartyBalance: (partyId) => {
    const entries = get().getEntriesByParty(partyId);
    const income = entries
      .filter((e) => e.side === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const expense = entries
      .filter((e) => e.side === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    return income - expense;
  },

  getTotalIncome: () => {
    return get().entries
      .filter((e) => e.side === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getTotalExpense: () => {
    return get().entries
      .filter((e) => e.side === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
  },

  getNetBalance: () => {
    return get().getTotalIncome() - get().getTotalExpense();
  },

  setData: (parties, entries) => set(() => {
    localStorage.setItem('khata_parties', JSON.stringify(parties));
    localStorage.setItem('khata_entries', JSON.stringify(entries));
    return { parties, entries };
  }),

  clearAll: () => set(() => {
    localStorage.removeItem('khata_parties');
    localStorage.removeItem('khata_entries');
    return { parties: [], entries: [] };
  }),
}));

export default useStore;
