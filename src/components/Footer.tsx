import { Heart, ArrowUp } from 'lucide-react'

interface FooterProps {
  gemachCount: number
}

export default function Footer({ gemachCount }: FooterProps) {
  return (
    <footer className="relative mt-10">
      {/* Curved separator */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)]">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" className="w-full h-10 md:h-14">
          <path d="M0 56h1440V28c-180 16-360 24-540 20S360 32 180 24C120 21 60 20 0 22v34z" fill="url(#footerGrad2)" />
          <defs>
            <linearGradient id="footerGrad2" x1="720" y1="0" x2="720" y2="56">
              <stop offset="0" stopColor="#1E2A5E" />
              <stop offset="1" stopColor="#141D45" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="bg-gradient-to-b from-navy to-navy-deep text-white/80 py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.06] text-sm font-semibold">
              <span className="tabular-nums">{gemachCount}</span>
              <span className="text-white/50">verified gemachs</span>
              <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
            </div>

            <p className="text-sm text-white/25 max-w-md mx-auto leading-relaxed">
              Built by Noam Small as a community resource for Bergen County.
              Every listing is verified with real contact information.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm pt-1">
              <a href="#suggest" className="text-gold/80 hover:text-gold transition-colors font-semibold">
                + Suggest a Gemach
              </a>
              <span className="text-white/[0.08]">|</span>
              <a href="#top" className="text-white/30 hover:text-white/60 transition-colors inline-flex items-center gap-1.5 font-medium">
                <ArrowUp className="w-3.5 h-3.5" />
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[11px] text-white/15 max-w-lg mx-auto leading-relaxed">
              Data is community-sourced and verified. Contact info may change over time.
              Please verify details before visiting. Last updated April 15, 2026.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
