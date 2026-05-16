import { Brain } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Setup', path: '/setup' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Auth', path: '/auth' },
];

export default function AppLayout() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400 text-ink">
              <Brain size={22} />
            </div>
            <div>
              <p className="text-sm text-sky-200">AI Confidence Coach</p>
              <h1 className="text-lg font-semibold">Interview Prep Studio</h1>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm transition ${
                    isActive
                      ? 'bg-white text-ink'
                      : 'border border-white/15 text-slate-200 hover:border-sky-300 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <Outlet />
      </section>
    </main>
  );
}
