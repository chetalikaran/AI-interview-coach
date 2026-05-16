import { MessageSquareText } from 'lucide-react';

export default function QuestionPreview({ questions }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-3">
        <MessageSquareText className="text-mint" size={22} />
        <div>
          <h2 className="text-xl font-semibold">Mock Interview Questions</h2>
          <p className="text-sm text-slate-400">Sample output for the first frontend milestone.</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-slate-400">
          Upload a resume and paste a job description to preview generated questions.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {questions.map((question) => (
            <article key={question} className="rounded-lg bg-ink/70 p-4 text-sm leading-6 text-slate-200">
              {question}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
