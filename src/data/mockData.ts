import { Account, Category, Debt, FinanceData, Goal, Transaction } from '@/types';

const categories: Category[] = [
  { id: 'cat-food', name: 'Alimentação', color: '#ff8f6b', icon: 'UtensilsCrossed', builtIn: true },
  { id: 'cat-transport', name: 'Transporte', color: '#7c9cff', icon: 'Car', builtIn: true },
  { id: 'cat-home', name: 'Moradia', color: '#ba8cff', icon: 'Home', builtIn: true },
  { id: 'cat-health', name: 'Saúde', color: '#55d6be', icon: 'HeartPulse', builtIn: true },
  { id: 'cat-leisure', name: 'Lazer', color: '#f6c760', icon: 'PartyPopper', builtIn: true },
  { id: 'cat-studies', name: 'Estudos', color: '#68a8ff', icon: 'GraduationCap', builtIn: true },
  { id: 'cat-investments', name: 'Investimentos', color: '#4ade80', icon: 'TrendingUp', builtIn: true },
  { id: 'cat-salary', name: 'Salário', color: '#45d483', icon: 'BadgeDollarSign', builtIn: true },
  { id: 'cat-freelance', name: 'Freelance', color: '#19b6ff', icon: 'BriefcaseBusiness', builtIn: true },
  { id: 'cat-others', name: 'Outros', color: '#94a3b8', icon: 'Shapes', builtIn: true }
];

const accounts: Account[] = [
  { id: 'acc-wallet', name: 'Carteira', type: 'Carteira', initialBalance: 320, color: '#ff8f6b' },
  { id: 'acc-checking', name: 'Conta corrente', type: 'Conta corrente', initialBalance: 2840, color: '#7c9cff' },
  { id: 'acc-savings', name: 'Poupança', type: 'Poupança', initialBalance: 6150, color: '#45d483' },
  { id: 'acc-card', name: 'Cartão', type: 'Cartão', initialBalance: -920, color: '#ba8cff' }
];

const transactions: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Salário empresa',
    amount: 6500,
    categoryId: 'cat-salary',
    type: 'receita',
    date: '2026-03-05',
    accountId: 'acc-checking',
    note: 'Pagamento mensal'
  },
  {
    id: 'tx-2',
    description: 'Projeto site institucional',
    amount: 1800,
    categoryId: 'cat-freelance',
    type: 'receita',
    date: '2026-03-10',
    accountId: 'acc-checking',
    note: 'Cliente recorrente'
  },
  {
    id: 'tx-3',
    description: 'Supermercado Prime',
    amount: 486.75,
    categoryId: 'cat-food',
    type: 'despesa',
    date: '2026-03-11',
    accountId: 'acc-card',
    note: 'Compra mensal'
  },
  {
    id: 'tx-4',
    description: 'Assinatura academia',
    amount: 129.9,
    categoryId: 'cat-health',
    type: 'despesa',
    date: '2026-03-12',
    accountId: 'acc-checking',
    note: ''
  },
  {
    id: 'tx-5',
    description: 'Combustível',
    amount: 220,
    categoryId: 'cat-transport',
    type: 'despesa',
    date: '2026-03-13',
    accountId: 'acc-wallet',
    note: ''
  },
  {
    id: 'tx-6',
    description: 'Reserva investimentos',
    amount: 900,
    categoryId: 'cat-investments',
    type: 'despesa',
    date: '2026-03-14',
    accountId: 'acc-savings',
    note: 'Aporte mensal'
  },
  {
    id: 'tx-7',
    description: 'Cinema e jantar',
    amount: 198,
    categoryId: 'cat-leisure',
    type: 'despesa',
    date: '2026-03-16',
    accountId: 'acc-card',
    note: 'Fim de semana'
  },
  {
    id: 'tx-8',
    description: 'Curso online',
    amount: 320,
    categoryId: 'cat-studies',
    type: 'despesa',
    date: '2026-02-20',
    accountId: 'acc-checking',
    note: ''
  },
  {
    id: 'tx-9',
    description: 'Aluguel',
    amount: 1750,
    categoryId: 'cat-home',
    type: 'despesa',
    date: '2026-03-08',
    accountId: 'acc-checking',
    note: 'Apartamento'
  }
];

const goals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Reserva de emergência',
    targetAmount: 5000,
    monthlyContribution: 500,
    currentAmount: 2200,
    deadline: '2026-11-30'
  },
  {
    id: 'goal-2',
    title: 'Viagem internacional',
    targetAmount: 12000,
    monthlyContribution: 800,
    currentAmount: 3800,
    deadline: '2027-06-30'
  }
];

const debts: Debt[] = [
  {
    id: 'debt-1',
    title: 'Notebook parcelado',
    totalAmount: 4800,
    installmentAmount: 400,
    totalInstallments: 12,
    paidInstallments: 5,
    dueDate: '2026-04-10',
    accountId: 'acc-card',
    categoryId: 'cat-studies',
    note: 'Compra para trabalho e estudos'
  },
  {
    id: 'debt-2',
    title: 'Curso de especialização',
    totalAmount: 2400,
    installmentAmount: 300,
    totalInstallments: 8,
    paidInstallments: 2,
    dueDate: '2026-03-25',
    accountId: 'acc-checking',
    categoryId: 'cat-studies',
    note: 'Pagamento mensal fixo'
  }
];

export const mockData: FinanceData = {
  transactions,
  categories,
  accounts,
  goals,
  debts
};
