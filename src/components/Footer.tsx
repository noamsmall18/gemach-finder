import { Heart, ArrowUp, ExternalLink } from 'lucide-react'

interface FooterProps {
  gemachCount: number
}

export default function Footer({ gemachCount }: FooterProps) {
  return (
    <footer className="relative mt-12">
      {/* Curved separator */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)]">
        <svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path d="M0 64h1440V32c-120 12-240 20-360 22s-240-2-360-8-240-14-360-14S120 38 0 44v20z" fill="url(#footerGrad3)" />
          <defs>
            <linearGradient id="footerGrad3" x1="720" y1="0" x2="720" y2="64">
              <stop offset="0" stopColor="#1E2A5E" />
              <stop offset="1" stopColor="#141D45" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="bg-gradient-to-b from-navy to-navy-deep text-white/80 py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-12">
            {/* Brand */}
            <div className="text-center md:text-left max-w-sm">
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
                    <path d="M50 20C35 20 25 32 25 44C25 65 50 82 50 82C50 82 75 65 75 44C75 32 65 20 50 20Z" fill="#D4A017" opacity="0.9"/>
                    <path d="M50 32C43 32 36 38 36 46C36 58 50 70 50 70C50 70 64 58 64 46C64 38 57 32 50 32Z" fill="white" opacity="0.7"/>
                  </svg>
                </div>
                <span className="font-heading text-lg font-bold text-white">GemachFinder</span>
              </div>
              <p className="text-sm text-white/25 mt-3 leading-relaxed">
                Built by Noam Small as a community resource for Bergen County.
                Every listing is verified with real contact information.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white tabular-nums">{gemachCount}</div>
                <div className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mt-0.5">Gemachs</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">9</div>
                <div className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mt-0.5">Categories</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Heart className="w-4 h-4 text-gold fill-gold" />
                </div>
                <div className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mt-0.5">Free</div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col items-center md:items-end gap-3 text-sm">
              <a href="#suggest" className="text-gold/70 hover:text-gold transition-colors font-semibold flex items-center gap-1.5">
                + Suggest a Gemach
              </a>
              <a href="#top" className="text-white/25 hover:text-white/50 transition-colors flex items-center gap-1.5 font-medium">
                <ArrowUp className="w-3.5 h-3.5" />
                Back to top
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[11px] text-white/12 max-w-lg mx-auto leading-relaxed">
              Data is community-sourced and verified. Contact info may change over time.
              Please verify details before visiting. Last updated April 15, 2026.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
