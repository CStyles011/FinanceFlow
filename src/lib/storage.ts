import { SupabaseClient } from '@supabase/supabase-js';
import { FinanceData } from '@/types';
import { mockData } from '@/data/mockData';

const STORAGE_KEY = 'financeflow-data-v1';

export function normalizeFinanceData(raw?: Partial<FinanceData> | null): FinanceData {
  return {
    transactions: raw?.transactions ?? mockData.transactions,
    categories: raw?.categories ?? mockData.categories,
    accounts: raw?.accounts ?? mockData.accounts,
    goals: raw?.goals ?? mockData.goals,
    debts: raw?.debts ?? mockData.debts
  };
}

export function loadLocalFinanceData(): FinanceData {
  if (typeof window === 'undefined') {
    return mockData;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
      return mockData;
    }

    return normalizeFinanceData(JSON.parse(raw) as FinanceData);
  } catch {
    return mockData;
  }
}

export function saveLocalFinanceData(data: FinanceData) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearLocalFinanceData() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function loadRemoteFinanceData(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('finance_records')
    .select('payload')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;

  if (!data?.payload) {
    const normalized = normalizeFinanceData(mockData);
    await saveRemoteFinanceData(supabase, userId, normalized);
    return normalized;
  }

  return normalizeFinanceData(data.payload as Partial<FinanceData>);
}

export async function saveRemoteFinanceData(
  supabase: SupabaseClient,
  userId: string,
  payload: FinanceData,
) {
  const { error } = await supabase.from('finance_records').upsert(
    {
      user_id: userId,
      payload
    },
    { onConflict: 'user_id' },
  );

  if (error) throw error;
}
