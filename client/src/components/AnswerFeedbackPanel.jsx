import { useState } from 'react';
import { MessageSquareText, Send } from 'lucide-react';
import { submitAnswerFeedback } from '../api/interviewApi.js';

export default function AnswerFeedbackPanel({ session, questions }) {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session || questions.length === 0) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('');
    setFeedback(null);

    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Please login before requesting answer feedback.');
      return;
    }

    if (!selectedQuestion) {
      setError('Choose a question before submitting your answer.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await submitAnswerFeedback({
        token,
        sessionId: session.id,
        question: selectedQuestion,
        answer,
      });

      setFeedback(data.feedback);
      setStatus('Feedback saved to this interview session.');
      setAnswer('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex items-center gap-3">
        <MessageSquareText className="text-sky-300" size={22} />
        <div>
          <h2 className="text-xl font-semibold">Answer Feedback</h2>
          <p className="text-sm text-slate-400">Practice one question and get coaching feedback.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Question</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-ink/70 p-3 text-sm text-white outline-none transition focus:border-sky-300"
            value={selectedQuestion}
            onChange={(event) => setSelectedQuestion(event.target.value)}
          >
            <option value="">Choose a question</option>
            {questions.map((question) => (
              <option key={question} value={question}>
                {question}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Your Answer</span>
          <textarea
            className="min-h-36 w-full resize-none rounded-lg border border-white/10 bg-ink/70 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300"
            placeholder="Type your interview answer here..."
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
        </label>

        <button
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 py-3 font-semibold text-ink transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedQuestion || answer.trim().length < 20 || isSubmitting}
        >
          <Send size={18} />
          {isSubmitting ? 'Reviewing Answer...' : 'Get AI Feedback'}
        </button>
      </form>

      {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {status && <p className="mt-4 rounded-lg border border-mint/30 bg-mint/10 p-3 text-sm text-mint">{status}</p>}

      {feedback && (
        <div className="mt-5 rounded-lg border border-white/10 bg-ink/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Confidence score</p>
              <p className="text-4xl font-semibold text-mint">{feedback.confidenceScore}%</p>
            </div>
            <p className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              Source: {feedback.feedbackSource}
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-white">Strengths</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {feedback.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white">Improvements</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                {feedback.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-semibold text-white">Suggested Answer</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feedback.suggestedAnswer}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h3 className="font-semibold text-white">Tone Feedback</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feedback.toneFeedback}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
