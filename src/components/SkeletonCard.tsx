export default function SkeletonCard() {
  return (
    <div className="bg-white/90 rounded-2xl border border-slate-100 overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-slate-100 to-transparent animate-pulse" />
      <div className="p-5 md:p-6">
        <div className="flex justify-between items-start">
          <div className="w-24 h-6 bg-slate-100/80 rounded-lg animate-pulse" />
          <div className="w-16 h-4 bg-slate-50 rounded-lg animate-pulse" />
        </div>
        <div className="w-3/4 h-5 bg-slate-100/80 rounded-lg mt-4 animate-pulse" />
        <div className="w-full h-4 bg-slate-50/80 rounded-lg mt-3 animate-pulse" />
        <div className="w-2/3 h-4 bg-slate-50/80 rounded-lg mt-1.5 animate-pulse" />
        <div className="flex gap-1.5 mt-4 pt-3.5 border-t border-slate-50">
          <div className="w-7 h-7 bg-slate-50 rounded-lg animate-pulse" />
          <div className="w-7 h-7 bg-slate-50 rounded-lg animate-pulse" />
          <div className="w-7 h-7 bg-slate-50 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
