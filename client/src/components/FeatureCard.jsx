export default function FeatureCard({ icon: Icon, title, text }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <Icon className="mb-3 text-sky-300" size={22} />
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}
