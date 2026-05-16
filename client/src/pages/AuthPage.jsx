import { useState } from 'react';
import { Brain, LogIn, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '../api/authApi.js';

const emptyForm = {
  name: '',
  email: '',
  password: '',
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isRegister = mode === 'register';

  function updateField(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('Checking your details...');

    try {
      const authAction = isRegister ? registerUser : loginUser;
      const payload = isRegister
        ? form
        : {
            email: form.email,
            password: form.password,
          };
      const data = await authAction(payload);

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      setCurrentUser(data.user);
      setStatus(isRegister ? 'Account created successfully.' : 'Signed in successfully.');
      setForm(emptyForm);
    } catch (requestError) {
      setError(requestError.message);
      setStatus('');
    }
  }

  function handleSignOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setCurrentUser(null);
    setStatus('Signed out.');
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400 text-ink">
            <Brain size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Authentication milestone</p>
            <h2 className="text-xl font-semibold">JWT Login</h2>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-300">
          Authentication proves who a user is. The backend checks credentials, creates a JWT,
          and the frontend stores that token so future API calls can include it.
        </p>

        {currentUser && (
          <div className="mt-6 rounded-lg border border-mint/30 bg-mint/10 p-4">
            <p className="text-sm text-slate-300">Signed in as</p>
            <p className="mt-1 font-semibold text-mint">{currentUser.name}</p>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
            <button
              className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-300 hover:text-white"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        )}
      </aside>

      <form className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow" onSubmit={handleSubmit}>
        <div className="mb-5 flex rounded-lg border border-white/10 bg-ink/70 p-1">
          <button
            type="button"
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
              !isRegister ? 'bg-white text-ink' : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setMode('login')}
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
              isRegister ? 'bg-white text-ink' : 'text-slate-300 hover:text-white'
            }`}
            onClick={() => setMode('register')}
          >
            <UserPlus size={16} />
            Register
          </button>
        </div>

        <h3 className="text-xl font-semibold">{isRegister ? 'Create your account' : 'Welcome back'}</h3>
        <p className="mt-1 text-sm text-slate-400">
          {isRegister ? 'Use a test account for now.' : 'Sign in with an account created during this server session.'}
        </p>

        {isRegister && (
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Name</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-ink/70 p-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={updateField}
            />
          </label>
        )}

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
          <input
            className="w-full rounded-lg border border-white/10 bg-ink/70 p-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={updateField}
          />
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            className="w-full rounded-lg border border-white/10 bg-ink/70 p-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={updateField}
          />
        </label>

        {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
        {status && <p className="mt-4 rounded-lg border border-sky-300/30 bg-sky-300/10 p-3 text-sm text-sky-100">{status}</p>}

        <button className="mt-5 w-full rounded-lg bg-sky-400 px-5 py-3 font-semibold text-ink transition hover:bg-sky-300">
          {isRegister ? 'Create account' : 'Login'}
        </button>
      </form>
    </section>
  );
}
