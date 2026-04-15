export default function SkeletonCard() {
  return (
    <div className="bg-white/80 rounded-2xl border border-slate-100/80 overflow-hidden">
      {/* Accent bar skeleton */}
      <div className="h-1 w-full bg-slate-100 animate-pulse" />
      <div className="p-5 pt-4">
        <div className="flex justify-between">
          <div className="w-28 h-6 bg-slate-100 rounded-full animate-pulse" />
          <div className="w-16 h-4 bg-slate-50 rounded-full animate-pulse" />
        </div>
        <div className="w-3/4 h-6 bg-slate-100 rounded mt-3 animate-pulse" />
        <div className="w-full h-4 bg-slate-50 rounded mt-2 animate-pulse" />
        <div className="w-2/3 h-4 bg-slate-50 rounded mt-1 animate-pulse" />
        <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
          <div className="w-16 h-6 bg-slate-50 rounded-full animate-pulse" />
          <div className="w-16 h-6 bg-slate-50 rounded-full animate-pulse" />
          <div className="w-12 h-6 bg-slate-50 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}
