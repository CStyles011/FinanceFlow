# FinanceFlow

Aplicativo web de controle financeiro pessoal com modo local e modo nuvem.

## Rodar localmente

```powershell
npm install
npm run dev
```

## Modo nuvem com Supabase

1. Crie um projeto no Supabase.
2. Execute o SQL de [supabase/schema.sql](/C:/Users/Usuario/Desktop/Danilo/Meus%20Programas/Nova%20pasta/supabase/schema.sql).
3. Crie um arquivo `.env` usando [.env.example](/C:/Users/Usuario/Desktop/Danilo/Meus%20Programas/Nova%20pasta/.env.example).
4. Preencha:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

5. Rode novamente:

```powershell
npm install
npm run dev
```

## Publicar na Vercel

1. Envie o projeto para o GitHub.
2. Importe o repositório na Vercel.
3. Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Use:

```text
Build command: npm run build
Output directory: dist
```

## Comportamento

- Sem Supabase: usa `localStorage`
- Com Supabase: login por e-mail e sincronização na nuvem
