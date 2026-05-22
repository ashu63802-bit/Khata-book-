export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const formatCurrency = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2 });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-IN');
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-IN');
};

export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
