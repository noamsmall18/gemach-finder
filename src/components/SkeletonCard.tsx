export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <div className="flex justify-between">
        <div className="w-28 h-6 bg-slate-100 rounded-full animate-pulse" />
        <div className="w-16 h-4 bg-slate-50 rounded-full animate-pulse" />
      </div>
      <div className="w-3/4 h-6 bg-slate-100 rounded mt-3 animate-pulse" />
      <div className="w-full h-4 bg-slate-50 rounded mt-2 animate-pulse" />
      <div className="w-2/3 h-4 bg-slate-50 rounded mt-1 animate-pulse" />
      <div className="flex gap-2 mt-4">
        <div className="w-28 h-7 bg-slate-50 rounded-full animate-pulse" />
        <div className="w-16 h-7 bg-slate-50 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
