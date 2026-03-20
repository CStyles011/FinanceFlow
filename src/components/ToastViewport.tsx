import clsx from 'clsx';
import { CheckCircle2, Info, OctagonAlert, X } from 'lucide-react';
import { useFinance } from '@/store/FinanceContext';

export function ToastViewport() {
  const { toast, clearToast } = useFinance();

  if (!toast) return null;

  const tones = {
    success: {
      className: 'border-success/30 bg-success/15 text-success',
      icon: CheckCircle2
    },
    danger: {
      className: 'border-danger/30 bg-danger/15 text-danger',
      icon: OctagonAlert
    },
    info: {
      className: 'border-brand/30 bg-brand/15 text-brand',
      icon: Info
    }
  };

  const Icon = tones[toast.tone].icon;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-sm">
      <div className={clsx('pointer-events-auto panel flex items-start gap-3 border px-4 py-4', tones[toast.tone].className)}>
        <div className="rounded-2xl bg-black/20 p-2">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">FinanceFlow</p>
          <p className="mt-1 text-sm text-slate-200">{toast.message}</p>
        </div>
        <button type="button" onClick={clearToast} className="rounded-xl p-1 text-slate-300 transition hover:bg-white/10 hover:text-white">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
