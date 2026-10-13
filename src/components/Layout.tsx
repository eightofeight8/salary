import type { ReactNode } from 'react';
import { Wallet } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Wallet className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-bold leading-none text-slate-100">FinanceFlow</h1>
              <p className="mt-0.5 text-xs text-slate-400">Учет личных финансов</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        <div className="flex flex-col gap-6">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur sm:hidden">
        <p className="text-center text-xs text-slate-500">FinanceFlow · данные хранятся в облаке</p>
      </nav>
    </div>
  );
}