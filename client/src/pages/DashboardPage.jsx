import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, FileText, History, Plus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listInterviewSessions } from '../api/interviewApi.js';

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('Loading your interview history...');
  const [error, setError] = useState('');
  const token = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('authUser');
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const totalQuestions = useMemo(
    () => sessions.reduce((total, session) => total + session.questions.length, 0),
    [sessions],
  );

  useEffect(() => {
    async function loadSessions() {
      if (!token) {
        setStatus('');
        setError('Please login to view your interview dashboard.');
        return;
      }

      try {
        const data = await listInterviewSessions(token);
        setSessions(data.sessions);
        setStatus('');
      } catch (requestError) {
        setStatus('');
        setError(requestError.message);
      }
    }

    loadSessions();
  }, [token]);

  return (
    <section className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
      <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-ink">
            <History size={21} />
          </div>
          <div>
            <p className="text-sm text-slate-400">Protected dashboard</p>
            <h2 className="text-xl font-semibold">Interview History</h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-300">
          This page reads interview sessions that belong to the signed-in user. MongoDB stores
          the history, and JWT authentication controls access.
        </p>

        <div className="mt-6 grid gap-3">
          <div className="rounded-lg border border-white/10 bg-ink/60 p-4">
            <p className="text-sm text-slate-400">Sessions</p>
            <p className="mt-1 text-3xl font-semibold text-mint">{sessions.length}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-ink/60 p-4">
            <p className="text-sm text-slate-400">Saved questions</p>
            <p className="mt-1 text-3xl font-semibold text-sky-300">{totalQuestions}</p>
          </div>
        </div>

        {currentUser && (
          <div className="mt-4 rounded-lg border border-white/10 bg-ink/60 p-4">
            <p className="text-sm text-slate-400">Signed in</p>
            <p className="mt-1 font-semibold text-white">{currentUser.name}</p>
            <p className="text-sm text-slate-400">{currentUser.email}</p>
          </div>
        )}
      </aside>

      <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Saved Sessions</h3>
            <p className="mt-1 text-sm text-slate-400">Review the interview prep you have created.</p>
          </div>
          <Link
            to="/setup"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-sky-300"
          >
            <Plus size={16} />
            New session
          </Link>
        </div>

        {status && <p className="mt-5 rounded-lg border border-sky-300/30 bg-sky-300/10 p-4 text-sm text-sky-100">{status}</p>}
        {error && (
          <div className="mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-4">
            <p className="text-sm text-red-200">{error}</p>
            <Link className="mt-3 inline-flex text-sm font-semibold text-red-100 hover:text-white" to="/auth">
              Go to authentication
            </Link>
          </div>
        )}

        {!status && !error && sessions.length === 0 && (
          <div className="mt-5 rounded-lg border border-dashed border-white/15 p-6 text-center">
            <ShieldCheck className="mx-auto text-sky-300" size={28} />
            <p className="mt-3 font-semibold text-white">No sessions yet</p>
            <p className="mt-2 text-sm text-slate-400">Create your first interview setup to start building history.</p>
          </div>
        )}

        <div className="mt-5 grid gap-4">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-white/10 bg-ink/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <FileText size={16} />
                    <span>{session.resumeFileName}</span>
                  </div>
                  <p className="mt-2 inline-flex rounded-full border border-white/10 px-2 py-1 text-xs text-slate-400">
                    Source: {session.questionSource}
                  </p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                    {session.jobDescription}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-sm text-slate-400">
                  <CalendarDays size={16} />
                  <span>{formatDate(session.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {session.questions.slice(0, 4).map((question) => (
                  <p key={question} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-200">
                    {question}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
