import { ArrowRight, Brain, FileText, Sparkles, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';

export default function HomePage() {
  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="pt-4">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/30 px-3 py-1 text-sm text-sky-200">
            <Sparkles size={16} />
            Phase 1 frontend foundation
          </p>
          <h2 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Practice interviews with focused AI questions and confidence feedback.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Build a preparation workspace that starts with your resume and a job description.
            The frontend now has routing and authentication screens, which gives us the base
            for saved interviews and personalized feedback.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/setup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-400 px-5 py-3 font-semibold text-ink transition hover:bg-sky-300"
            >
              Start interview setup
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 font-semibold text-slate-200 transition hover:border-sky-300 hover:text-white"
            >
              Try authentication
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 font-semibold text-slate-200 transition hover:border-sky-300 hover:text-white"
            >
              View dashboard
            </Link>
          </div>
        </div>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow">
          <h3 className="text-xl font-semibold">Build Plan</h3>
          <div className="mt-5 grid gap-3">
            <FeatureCard icon={FileText} title="1. Frontend" text="Create pages, forms, and user flow." />
            <FeatureCard icon={Target} title="2. Auth API" text="Register, login, and protect user data." />
            <FeatureCard icon={Brain} title="3. Dashboard" text="Review saved MongoDB interview sessions." />
          </div>
        </section>
      </section>
    </>
  );
}
