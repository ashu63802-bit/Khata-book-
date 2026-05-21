/**
 * Validation layer for Khata Book
 * Provides type-safe validation for all data inputs
 */

export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

// Regex patterns for validation
const PHONE_PATTERN = /^[6-9]\d{9}$/; // Indian phone numbers
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/; // HH:MM format

// Party validation
export const validatePartyInput = (input: {
  name?: unknown;
  phone?: unknown;
}): ValidationResult<{ name: string; phone?: string }> => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!input.name || typeof input.name !== "string") {
    errors.push({ field: "name", message: "Name is required and must be a string" });
  } else if (input.name.trim().length === 0) {
    errors.push({ field: "name", message: "Name cannot be empty" });
  } else if (input.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  } else if (input.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name cannot exceed 100 characters" });
  }

  // Phone validation (optional)
  let phone: string | undefined;
  if (input.phone !== undefined) {
    if (typeof input.phone !== "string") {
      errors.push({ field: "phone", message: "Phone must be a string" });
    } else if (input.phone.trim().length > 0) {
      const trimmedPhone = input.phone.trim();
      if (!PHONE_PATTERN.test(trimmedPhone)) {
        errors.push({
          field: "phone",
          message: "Phone must be a valid Indian phone number (10 digits starting with 6-9)",
        });
      } else {
        phone = trimmedPhone;
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: input.name as string,
      phone,
    },
  };
};

// Entry validation
export const validateEntryInput = (input: {
  partyId?: unknown;
  date?: unknown;
  side?: unknown;
  amount?: unknown;
  note?: unknown;
  time?: unknown;
}): ValidationResult<{
  partyId: string;
  date: string;
  side: "income" | "expense";
  amount: number;
  note: string;
  time?: string;
}> => {
  const errors: ValidationError[] = [];

  // PartyId validation
  if (!input.partyId || typeof input.partyId !== "string") {
    errors.push({ field: "partyId", message: "Party ID is required" });
  }

  // Date validation
  if (!input.date || typeof input.date !== "string") {
    errors.push({ field: "date", message: "Date is required" });
  } else if (!ISO_DATE_PATTERN.test(input.date)) {
    errors.push({ field: "date", message: "Date must be in YYYY-MM-DD format" });
  } else {
    // Check if date is valid
    const [y, m, d] = input.date.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      errors.push({ field: "date", message: "Invalid date" });
    }
  }

  // Side validation
  if (!input.side || typeof input.side !== "string") {
    errors.push({ field: "side", message: "Side (income/expense) is required" });
  } else if (!["income", "expense"].includes(input.side)) {
    errors.push({ field: "side", message: "Side must be 'income' or 'expense'" });
  }

  // Amount validation
  if (input.amount === undefined || input.amount === null) {
    errors.push({ field: "amount", message: "Amount is required" });
  } else if (typeof input.amount !== "number") {
    errors.push({ field: "amount", message: "Amount must be a number" });
  } else if (input.amount <= 0) {
    errors.push({ field: "amount", message: "Amount must be greater than 0" });
  } else if (input.amount > 99999999) {
    errors.push({ field: "amount", message: "Amount is too large" });
  }

  // Note validation
  if (!input.note || typeof input.note !== "string") {
    errors.push({ field: "note", message: "Note is required" });
  } else if (input.note.trim().length === 0) {
    errors.push({ field: "note", message: "Note cannot be empty" });
  } else if (input.note.trim().length > 500) {
    errors.push({ field: "note", message: "Note cannot exceed 500 characters" });
  }

  // Time validation (optional)
  let time: string | undefined;
  if (input.time !== undefined) {
    if (typeof input.time !== "string") {
      errors.push({ field: "time", message: "Time must be a string" });
    } else if (input.time.trim().length > 0) {
      const trimmedTime = input.time.trim();
      if (!TIME_PATTERN.test(trimmedTime)) {
        errors.push({
          field: "time",
          message: "Time must be in HH:MM format (24-hour)",
        });
      } else {
        time = trimmedTime;
      }
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      partyId: input.partyId as string,
      date: input.date as string,
      side: input.side as "income" | "expense",
      amount: input.amount as number,
      note: (input.note as string).trim(),
      time,
    },
  };
};

// Utility validators
export const isValidISODate = (date: string): boolean => {
  if (!ISO_DATE_PATTERN.test(date)) return false;
  const [y, m, d] = date.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return (
    dateObj.getFullYear() === y &&
    dateObj.getMonth() === m - 1 &&
    dateObj.getDate() === d
  );
};

export const isValidPhoneNumber = (phone: string): boolean => {
  return PHONE_PATTERN.test(phone.trim());
};

export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 99999999 && Number.isFinite(amount);
};

export const isValidTime = (time: string): boolean => {
  return TIME_PATTERN.test(time.trim());
};
