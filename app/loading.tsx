export default function Loading() {
  return (
    <div className="page-wrap py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-14 w-2/3 rounded-2xl bg-slate-200" />
        <div className="h-40 rounded-3xl bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
