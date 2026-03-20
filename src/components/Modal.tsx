import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

interface ModalProps extends PropsWithChildren {
  title: string;
  open: boolean;
  onClose: () => void;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040b]/80 p-4 backdrop-blur-md">
      <div className="panel animate-rise w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">Preencha os dados abaixo para continuar.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
