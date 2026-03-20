export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short'
  }).format(new Date(`${value}T00:00:00`));

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;

export const parseCurrencyInput = (raw: string) => {
  const numeric = raw.replace(/\D/g, '');
  return Number(numeric) / 100;
};

export const formatCurrencyInput = (value: number) =>
  value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
