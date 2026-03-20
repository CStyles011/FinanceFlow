export type EntryType = 'receita' | 'despesa';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  builtIn?: boolean;
}

export interface Account {
  id: string;
  name: string;
  type: 'Carteira' | 'Conta corrente' | 'Poupança' | 'Cartão' | 'Outro';
  initialBalance: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  type: EntryType;
  date: string;
  accountId: string;
  note: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  monthlyContribution: number;
  currentAmount: number;
  deadline?: string;
}

export interface Debt {
  id: string;
  title: string;
  totalAmount: number;
  installmentAmount: number;
  totalInstallments: number;
  paidInstallments: number;
  dueDate: string;
  accountId: string;
  categoryId: string;
  note: string;
}

export interface Filters {
  month: string;
  startDate: string;
  endDate: string;
  categoryId: string;
  type: 'todos' | EntryType;
  accountId: string;
  query: string;
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  goals: Goal[];
  debts: Debt[];
}
