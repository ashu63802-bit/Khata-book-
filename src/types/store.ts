export interface Party {
  id: string;
  name: string;
  phone?: string;
  createdAt: number;
  notes?: string;
}

export interface Entry {
  id: string;
  partyId: string;
  date: string;
  time?: string;
  side: 'income' | 'expense';
  amount: number;
  note: string;
  createdAt: number;
}

export interface DayTotal {
  date: string;
  income: number;
  expense: number;
  balance: number;
}
