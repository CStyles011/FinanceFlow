import { Download, LogOut, RotateCcw } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { mockData } from '@/data/mockData';
import { useFinance } from '@/store/FinanceContext';
import { useAuth } from '@/store/AuthContext';

export function SettingsPage() {
  const { exportBackup, resetData, storageMode } = useFinance();
  const { cloudEnabled, user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Configurações"
        title="Preferências e manutenção"
        description="Veja o modo de armazenamento atual, gerencie sua conta e mantenha o FinanceFlow pronto para acesso local ou online."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="panel p-5">
          <h3 className="text-xl font-semibold">Armazenamento</h3>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            {storageMode === 'cloud'
              ? 'Seus dados estão sincronizados na nuvem e vinculados à sua conta.'
              : 'Seus dados estão salvos somente neste navegador até você configurar o modo nuvem.'}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Modo de armazenamento</p>
              <p className="mt-2 font-semibold">
                {storageMode === 'cloud' ? 'Nuvem sincronizada' : 'Local e imediato'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Dados iniciais</p>
              <p className="mt-2 font-semibold">{mockData.transactions.length} transações mockadas</p>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <h3 className="text-xl font-semibold">Conta e acesso</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Status cloud</p>
              <p className="mt-2 font-semibold">{cloudEnabled ? 'Configurado' : 'Ainda não configurado'}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-sm text-slate-400">Usuário atual</p>
              <p className="mt-2 break-all font-semibold">{user?.email ?? 'Modo local sem login'}</p>
            </div>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} /> Sair da conta
              </span>
            </button>
          ) : null}
        </div>

        <div className="panel p-5">
          <h3 className="text-xl font-semibold">Recomendações</h3>
          <div className="mt-4 space-y-3">
            {[
              'Use a exportação CSV para manter um backup periódico das movimentações.',
              'Acompanhe metas mensalmente para ajustar aportes e prazos.',
              'Publique com Supabase para acessar seus dados de qualquer lugar.'
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportBackup}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              <span className="flex items-center gap-2">
                <Download size={16} /> Backup manual
              </span>
            </button>
            <button
              type="button"
              onClick={resetData}
              className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-medium text-danger transition hover:bg-danger/20"
            >
              <span className="flex items-center gap-2">
                <RotateCcw size={16} /> Limpar dados
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
