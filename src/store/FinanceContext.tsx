import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { mockData } from '@/data/mockData';
import {
  clearLocalFinanceData,
  loadLocalFinanceData,
  loadRemoteFinanceData,
  normalizeFinanceData,
  saveLocalFinanceData,
  saveRemoteFinanceData
} from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { Account, Category, Debt, Filters, Goal, Transaction } from '@/types';
import { getCurrentMonth, uid } from '@/lib/utils';
import { useAuth } from '@/store/AuthContext';

interface ToastState {
  message: string;
  tone: 'success' | 'danger' | 'info';
}

interface FinanceContextValue {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  goals: Goal[];
  debts: Debt[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transactionId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (accountId: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  updateDebt: (debt: Debt) => void;
  deleteDebt: (debtId: string) => void;
  filteredTransactions: Transaction[];
  accountBalances: Array<Account & { balance: number }>;
  toast: ToastState | null;
  clearToast: () => void;
  resetData: () => void;
  exportBackup: () => void;
  isReady: boolean;
  storageMode: 'local' | 'cloud';
}

const initialFilters: Filters = {
  month: getCurrentMonth(),
  startDate: '',
  endDate: '',
  categoryId: 'todos',
  type: 'todos',
  accountId: 'todos',
  query: ''
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: PropsWithChildren) {
  const { user, cloudEnabled, loading: authLoading } = useAuth();
  const [data, setData] = useState(() => normalizeFinanceData(mockData));
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);
  const storageMode: 'local' | 'cloud' = cloudEnabled && user ? 'cloud' : 'local';

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (authLoading) return;

    let active = true;

    async function bootstrap() {
      setIsReady(false);

      try {
        if (cloudEnabled && user && supabase) {
          const remoteData = await loadRemoteFinanceData(supabase, user.id);
          if (active) setData(remoteData);
        } else {
          if (active) setData(loadLocalFinanceData());
        }
      } catch {
        if (active) {
          setData(loadLocalFinanceData());
          setToast({
            message: 'Falha ao carregar a nuvem. FinanceFlow entrou em modo local.',
            tone: 'danger'
          });
        }
      } finally {
        if (active) {
          initializedRef.current = true;
          setIsReady(true);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [authLoading, cloudEnabled, user]);

  useEffect(() => {
    if (!initializedRef.current || !isReady) return;

    if (storageMode === 'local') {
      saveLocalFinanceData(data);
      return;
    }

    if (storageMode === 'cloud' && supabase && user) {
      saveRemoteFinanceData(supabase, user.id, data).catch(() => {
        setToast({
          message: 'Não foi possível sincronizar a nuvem agora.',
          tone: 'danger'
        });
      });
    }
  }, [data, isReady, storageMode, user]);

  const filteredTransactions = useMemo(
    () =>
      data.transactions
        .filter((transaction) => {
          if (filters.month && !transaction.date.startsWith(filters.month)) return false;
          if (filters.startDate && transaction.date < filters.startDate) return false;
          if (filters.endDate && transaction.date > filters.endDate) return false;
          if (filters.categoryId !== 'todos' && transaction.categoryId !== filters.categoryId) return false;
          if (filters.type !== 'todos' && transaction.type !== filters.type) return false;
          if (filters.accountId !== 'todos' && transaction.accountId !== filters.accountId) return false;
          if (filters.query && !transaction.description.toLowerCase().includes(filters.query.toLowerCase())) {
            return false;
          }
          return true;
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [data.transactions, filters],
  );

  const accountBalances = useMemo(
    () =>
      data.accounts.map((account) => {
        const variation = data.transactions
          .filter((transaction) => transaction.accountId === account.id)
          .reduce(
            (total, transaction) =>
              total + (transaction.type === 'receita' ? transaction.amount : -transaction.amount),
            0,
          );

        return {
          ...account,
          balance: account.initialBalance + variation
        };
      }),
    [data.accounts, data.transactions],
  );

  const value: FinanceContextValue = {
    ...data,
    filters,
    setFilters,
    addTransaction: (transaction) => {
      setData((current) => ({
        ...current,
        transactions: [{ ...transaction, id: uid('tx') }, ...current.transactions]
      }));
      setToast({ message: 'Transação salva com sucesso.', tone: 'success' });
    },
    updateTransaction: (transaction) => {
      setData((current) => ({
        ...current,
        transactions: current.transactions.map((item) => (item.id === transaction.id ? transaction : item))
      }));
      setToast({ message: 'Transação atualizada.', tone: 'success' });
    },
    deleteTransaction: (transactionId) => {
      setData((current) => ({
        ...current,
        transactions: current.transactions.filter((item) => item.id !== transactionId)
      }));
      setToast({ message: 'Transação removida.', tone: 'info' });
    },
    addCategory: (category) => {
      setData((current) => ({
        ...current,
        categories: [...current.categories, { ...category, id: uid('cat') }]
      }));
      setToast({ message: 'Categoria criada.', tone: 'success' });
    },
    updateCategory: (category) => {
      setData((current) => ({
        ...current,
        categories: current.categories.map((item) => (item.id === category.id ? category : item))
      }));
      setToast({ message: 'Categoria atualizada.', tone: 'success' });
    },
    deleteCategory: (categoryId) => {
      setData((current) => ({
        ...current,
        categories: current.categories.filter((item) => item.id !== categoryId || item.builtIn),
        transactions: current.transactions.map((transaction) =>
          transaction.categoryId === categoryId ? { ...transaction, categoryId: 'cat-others' } : transaction,
        )
      }));
      setToast({ message: 'Categoria removida.', tone: 'info' });
    },
    addAccount: (account) => {
      setData((current) => ({
        ...current,
        accounts: [...current.accounts, { ...account, id: uid('acc') }]
      }));
      setToast({ message: 'Conta criada.', tone: 'success' });
    },
    updateAccount: (account) => {
      setData((current) => ({
        ...current,
        accounts: current.accounts.map((item) => (item.id === account.id ? account : item))
      }));
      setToast({ message: 'Conta atualizada.', tone: 'success' });
    },
    deleteAccount: (accountId) => {
      setData((current) => {
        if (current.accounts.length <= 1) {
          setToast({ message: 'Mantenha pelo menos uma conta cadastrada.', tone: 'danger' });
          return current;
        }

        const fallbackAccount = current.accounts.find((item) => item.id !== accountId)?.id ?? accountId;
        setToast({ message: 'Conta removida.', tone: 'info' });

        return {
          ...current,
          accounts: current.accounts.filter((item) => item.id !== accountId),
          transactions: current.transactions.map((transaction) =>
            transaction.accountId === accountId ? { ...transaction, accountId: fallbackAccount } : transaction,
          ),
          debts: current.debts.map((debt) =>
            debt.accountId === accountId ? { ...debt, accountId: fallbackAccount } : debt,
          )
        };
      });
    },
    addGoal: (goal) => {
      setData((current) => ({
        ...current,
        goals: [...current.goals, { ...goal, id: uid('goal') }]
      }));
      setToast({ message: 'Meta criada.', tone: 'success' });
    },
    updateGoal: (goal) => {
      setData((current) => ({
        ...current,
        goals: current.goals.map((item) => (item.id === goal.id ? goal : item))
      }));
      setToast({ message: 'Meta atualizada.', tone: 'success' });
    },
    deleteGoal: (goalId) => {
      setData((current) => ({
        ...current,
        goals: current.goals.filter((item) => item.id !== goalId)
      }));
      setToast({ message: 'Meta removida.', tone: 'info' });
    },
    addDebt: (debt) => {
      setData((current) => ({
        ...current,
        debts: [...current.debts, { ...debt, id: uid('debt') }]
      }));
      setToast({ message: 'Dívida futura cadastrada.', tone: 'success' });
    },
    updateDebt: (debt) => {
      setData((current) => ({
        ...current,
        debts: current.debts.map((item) => (item.id === debt.id ? debt : item))
      }));
      setToast({ message: 'Dívida atualizada.', tone: 'success' });
    },
    deleteDebt: (debtId) => {
      setData((current) => ({
        ...current,
        debts: current.debts.filter((item) => item.id !== debtId)
      }));
      setToast({ message: 'Dívida removida.', tone: 'info' });
    },
    filteredTransactions,
    accountBalances,
    toast,
    clearToast: () => setToast(null),
    resetData: () => {
      if (storageMode === 'local') {
        clearLocalFinanceData();
      }
      setData(normalizeFinanceData(mockData));
      setToast({ message: 'Dados restaurados para o modelo inicial.', tone: 'success' });
    },
    exportBackup: () => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'financeflow-backup.json';
      link.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'Backup exportado em JSON.', tone: 'success' });
    },
    isReady,
    storageMode
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
