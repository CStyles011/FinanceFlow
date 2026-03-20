import { FormEvent, useState } from 'react';
import { Cloud, LockKeyhole, Mail } from 'lucide-react';
import { FormField } from '@/components/forms/FormField';
import { useAuth } from '@/store/AuthContext';

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const result =
      mode === 'login' ? await signIn(email, password) : await signUp(email, password);

    setLoading(false);
    setMessage(result.error ?? '');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel hidden p-8 lg:block">
          <p className="text-xs uppercase tracking-[0.32em] text-brand/70">FinanceFlow Cloud</p>
          <h1 className="mt-4 max-w-xl text-5xl font-bold leading-tight">
            Sua planilha financeira acessível de qualquer lugar.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Entre com sua conta para sincronizar transações, metas, contas e dívidas futuras na nuvem.
            Depois disso, você poderá abrir o FinanceFlow em qualquer PC ou celular.
          </p>

          <div className="mt-10 grid gap-4">
            {[
              'Sincronização automática entre dispositivos',
              'Login com e-mail e senha',
              'Dados organizados por usuário'
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6 sm:p-8">
          <div className="mx-auto max-w-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-accent text-ink">
              <Cloud size={22} />
            </div>
            <h2 className="mt-6 text-3xl font-bold">
              {mode === 'login' ? 'Entrar na sua conta' : 'Criar conta online'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {mode === 'login'
                ? 'Acesse seus dados financeiros salvos na nuvem.'
                : 'Crie seu acesso para usar o FinanceFlow em qualquer lugar.'}
            </p>

            <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-2xl px-4 py-2 text-sm transition ${mode === 'login' ? 'bg-brand text-ink' : 'text-slate-300'}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-2xl px-4 py-2 text-sm transition ${mode === 'register' ? 'bg-brand text-ink' : 'text-slate-300'}`}
              >
                Criar conta
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <FormField
                label="E-mail"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                icon={<Mail size={16} />}
              />
              <FormField
                label="Senha"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo de 6 caracteres"
                icon={<LockKeyhole size={16} />}
              />

              {message ? <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">{message}</div> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-brand to-accent px-5 py-3 text-sm font-semibold text-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
