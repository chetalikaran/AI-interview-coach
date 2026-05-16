import { useMemo, useState } from 'react';
import { FileText, Sparkles, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createInterviewSession } from '../api/interviewApi.js';
import AnswerFeedbackPanel from '../components/AnswerFeedbackPanel.jsx';
import QuestionPreview from '../components/QuestionPreview.jsx';

export default function InterviewSetupPage() {
  const [resumeName, setResumeName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [savedSession, setSavedSession] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authToken = localStorage.getItem('authToken');

  const readinessScore = useMemo(() => {
    let score = 20;
    if (resumeName) score += 35;
    if (jobDescription.trim().length > 80) score += 45;
    return Math.min(score, 100);
  }, [resumeName, jobDescription]);

  function handleResumeChange(event) {
    const file = event.target.files?.[0];
    setResumeName(file ? file.name : '');
    setQuestions([]);
    setSavedSession(null);
  }

  function handleJobDescriptionChange(event) {
    setJobDescription(event.target.value);
    setQuestions([]);
    setSavedSession(null);
  }

  async function handleGenerateQuestions() {
    setError('');
    setStatus('');

    if (!authToken) {
      setError('Please login before creating an interview session.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createInterviewSession({
        token: authToken,
        resumeFileName: resumeName,
        jobDescription,
      });

      setSavedSession(data.session);
      setQuestions(data.session.questions);
      setStatus('Interview session saved and questions generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-ink">
              <FileText size={21} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Current milestone</p>
              <h2 className="text-xl font-semibold">Interview Setup</h2>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            This page now sends your setup data to a protected Express route. The backend
            saves a session in MongoDB and returns starter questions.
          </p>

          <div className="mt-6 rounded-lg border border-white/10 bg-ink/60 p-4">
            <p className="text-sm text-slate-400">Readiness score</p>
            <p className="mt-2 text-4xl font-semibold text-mint">{readinessScore}%</p>
            <p className="mt-2 text-sm text-slate-400">
              Upload a resume and add a detailed job description to increase this score.
            </p>
          </div>

          {!authToken && (
            <div className="mt-4 rounded-lg border border-sky-300/30 bg-sky-300/10 p-4">
              <p className="text-sm text-sky-100">Login is required before saving an interview session.</p>
              <Link className="mt-3 inline-flex text-sm font-semibold text-sky-200 hover:text-white" to="/auth">
                Go to authentication
              </Link>
            </div>
          )}
        </aside>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-glow backdrop-blur">
          <div className="mb-5">
            <h3 className="text-xl font-semibold">Role Details</h3>
            <p className="mt-1 text-sm text-slate-400">Start with resume and job details.</p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Resume</span>
            <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-ink/60 px-4 py-8 text-center transition hover:border-sky-300/70">
              <UploadCloud className="mb-3 text-sky-300" size={30} />
              <span className="text-sm text-slate-300">
                {resumeName || 'Upload your resume PDF or DOCX'}
              </span>
              <input className="sr-only" type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
            </div>
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Job Description</span>
            <textarea
              className="min-h-48 w-full resize-none rounded-lg border border-white/10 bg-ink/70 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={handleJobDescriptionChange}
            />
          </label>

          <button
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-400 px-5 py-3 font-semibold text-ink transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!resumeName || jobDescription.trim().length < 20 || isSubmitting}
            onClick={handleGenerateQuestions}
          >
            <Sparkles size={18} />
            {isSubmitting ? 'Saving Session...' : 'Generate Mock Questions'}
          </button>

          {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
          {status && <p className="mt-4 rounded-lg border border-mint/30 bg-mint/10 p-3 text-sm text-mint">{status}</p>}
          {savedSession && (
            <div className="mt-3 text-xs text-slate-500">
              <p>Saved session ID: {savedSession.id}</p>
              <p>Question source: {savedSession.questionSource}</p>
            </div>
          )}
        </section>
      </section>

      <QuestionPreview questions={questions} />
      <AnswerFeedbackPanel session={savedSession} questions={questions} />
    </>
  );
}
