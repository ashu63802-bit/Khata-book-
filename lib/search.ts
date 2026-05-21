/**
 * Search, filter, and analytics utilities for Khata Book
 */

import type { Party, Entry } from "./store";

// Search result types
export type SearchResult<T> = {
  item: T;
  score: number;
};

export type FilterOptions = {
  partyId?: string;
  dateFrom?: string;
  dateTo?: string;
  side?: "income" | "expense";
  minAmount?: number;
  maxAmount?: number;
  noteKeywords?: string[];
};

// Similarity scoring function (Levenshtein distance)
const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1.includes(s2) || s2.includes(s1)) return 1;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const getEditDistance = (s1: string, s2: string): number => {
  const costs: number[] = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
};

// Party search with fuzzy matching
export const searchParties = (
  parties: Party[],
  query: string,
  minSimilarity: number = 0.3
): SearchResult<Party>[] => {
  if (!query || query.trim().length === 0) return [];

  const results = parties
    .map((party) => ({
      item: party,
      score: Math.max(
        calculateSimilarity(party.name, query),
        party.phone ? calculateSimilarity(party.phone, query) : 0
      ),
    }))
    .filter((result) => result.score >= minSimilarity)
    .sort((a, b) => b.score - a.score);

  return results;
};

// Entry search with fuzzy matching on note
export const searchEntries = (
  entries: Entry[],
  query: string,
  minSimilarity: number = 0.3
): SearchResult<Entry>[] => {
  if (!query || query.trim().length === 0) return [];

  const results = entries
    .map((entry) => ({
      item: entry,
      score: calculateSimilarity(entry.note, query),
    }))
    .filter((result) => result.score >= minSimilarity)
    .sort((a, b) => b.score - a.score);

  return results;
};

// Advanced entry filtering
export const filterEntries = (entries: Entry[], options: FilterOptions): Entry[] => {
  return entries.filter((entry) => {
    // Filter by party ID
    if (options.partyId && entry.partyId !== options.partyId) return false;

    // Filter by date range
    if (options.dateFrom && entry.date < options.dateFrom) return false;
    if (options.dateTo && entry.date > options.dateTo) return false;

    // Filter by side (income/expense)
    if (options.side && entry.side !== options.side) return false;

    // Filter by amount range
    if (options.minAmount && entry.amount < options.minAmount) return false;
    if (options.maxAmount && entry.amount > options.maxAmount) return false;

    // Filter by note keywords
    if (options.noteKeywords && options.noteKeywords.length > 0) {
      const hasAllKeywords = options.noteKeywords.every((keyword) =>
        entry.note.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!hasAllKeywords) return false;
    }

    return true;
  });
};

// Get entries for a specific month
export const getEntriesByMonth = (
  entries: Entry[],
  year: number,
  month: number
): Entry[] => {
  const monthStr = String(month).padStart(2, "0");
  const yearStr = year.toString();
  const prefix = `${yearStr}-${monthStr}`;

  return entries.filter((entry) => entry.date.startsWith(prefix));
};

// Get entries for a specific year
export const getEntriesByYear = (entries: Entry[], year: number): Entry[] => {
  const yearStr = year.toString();
  return entries.filter((entry) => entry.date.startsWith(yearStr));
};

// Calculate statistics for entries
export type EntryStatistics = {
  totalCount: number;
  incomeCount: number;
  expenseCount: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  averageIncome: number;
  averageExpense: number;
  maxIncome: number;
  maxExpense: number;
  minIncome: number;
  minExpense: number;
  dateRange: { from: string; to: string } | null;
};

export const calculateEntryStatistics = (entries: Entry[]): EntryStatistics => {
  if (entries.length === 0) {
    return {
      totalCount: 0,
      incomeCount: 0,
      expenseCount: 0,
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      averageIncome: 0,
      averageExpense: 0,
      maxIncome: 0,
      maxExpense: 0,
      minIncome: 0,
      minExpense: 0,
      dateRange: null,
    };
  }

  const incomes = entries.filter((e) => e.side === "income").map((e) => e.amount);
  const expenses = entries.filter((e) => e.side === "expense").map((e) => e.amount);

  const totalIncome = incomes.reduce((sum, amount) => sum + amount, 0);
  const totalExpense = expenses.reduce((sum, amount) => sum + amount, 0);

  const dates = entries.map((e) => e.date).sort();

  return {
    totalCount: entries.length,
    incomeCount: incomes.length,
    expenseCount: expenses.length,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    averageIncome: incomes.length > 0 ? totalIncome / incomes.length : 0,
    averageExpense: expenses.length > 0 ? totalExpense / expenses.length : 0,
    maxIncome: incomes.length > 0 ? Math.max(...incomes) : 0,
    maxExpense: expenses.length > 0 ? Math.max(...expenses) : 0,
    minIncome: incomes.length > 0 ? Math.min(...incomes) : 0,
    minExpense: expenses.length > 0 ? Math.min(...expenses) : 0,
    dateRange:
      dates.length > 0
        ? { from: dates[0], to: dates[dates.length - 1] }
        : null,
  };
};

// Find duplicate parties (similar names)
export type DuplicateParties = {
  party1: Party;
  party2: Party;
  similarity: number;
};

export const findDuplicateParties = (
  parties: Party[],
  threshold: number = 0.8
): DuplicateParties[] => {
  const duplicates: DuplicateParties[] = [];

  for (let i = 0; i < parties.length; i++) {
    for (let j = i + 1; j < parties.length; j++) {
      const similarity = calculateSimilarity(parties[i].name, parties[j].name);
      if (similarity >= threshold) {
        duplicates.push({
          party1: parties[i],
          party2: parties[j],
          similarity,
        });
      }
    }
  }

  return duplicates.sort((a, b) => b.similarity - a.similarity);
};

// Get distribution of entries by side
export const getEntryDistribution = (entries: Entry[]) => {
  const incomeCount = entries.filter((e) => e.side === "income").length;
  const expenseCount = entries.filter((e) => e.side === "expense").length;

  return {
    incomeCount,
    expenseCount,
    incomePercentage:
      entries.length > 0 ? (incomeCount / entries.length) * 100 : 0,
    expensePercentage:
      entries.length > 0 ? (expenseCount / entries.length) * 100 : 0,
  };
};

// Summary statistics for all data
export type DataSummary = {
  partyCount: number;
  entryCount: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  dateRange: { from: string; to: string } | null;
  topPartyByIncome: { party: Party; amount: number } | null;
  topPartyByExpense: { party: Party; amount: number } | null;
};

export const generateDataSummary = (
  parties: Party[],
  entries: Entry[]
): DataSummary => {
  const stats = calculateEntryStatistics(entries);

  // Find top party by income
  let topPartyByIncome: { party: Party; amount: number } | null = null;
  parties.forEach((party) => {
    const partyIncome = entries
      .filter((e) => e.partyId === party.id && e.side === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    if (!topPartyByIncome || partyIncome > topPartyByIncome.amount) {
      topPartyByIncome = { party, amount: partyIncome };
    }
  });

  // Find top party by expense
  let topPartyByExpense: { party: Party; amount: number } | null = null;
  parties.forEach((party) => {
    const partyExpense = entries
      .filter((e) => e.partyId === party.id && e.side === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    if (!topPartyByExpense || partyExpense > topPartyByExpense.amount) {
      topPartyByExpense = { party, amount: partyExpense };
    }
  });

  return {
    partyCount: parties.length,
    entryCount: entries.length,
    totalIncome: stats.totalIncome,
    totalExpense: stats.totalExpense,
    netBalance: stats.netBalance,
    dateRange: stats.dateRange,
    topPartyByIncome: topPartyByIncome && topPartyByIncome.amount > 0 ? topPartyByIncome : null,
    topPartyByExpense: topPartyByExpense && topPartyByExpense.amount > 0 ? topPartyByExpense : null,
  };
};
