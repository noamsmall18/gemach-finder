import { Heart } from 'lucide-react'

interface FooterProps {
  gemachCount: number
}

export default function Footer({ gemachCount }: FooterProps) {
  return (
    <footer className="relative mt-8">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[calc(100%-1px)]">
        <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
          <path d="M0 48h1440V24c-240 20-480 24-720 12S240 4 0 24v24z" fill="url(#footerGrad)" />
          <defs>
            <linearGradient id="footerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2D3A6E" />
              <stop offset="1" stopColor="#1E2A5E" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="bg-gradient-to-b from-navy to-navy-deep text-cream/90 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-sm">
            <span>{gemachCount} gemachs listed</span>
            <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
          </div>

          <p className="text-sm text-cream/50">
            Built by Noam Small as a community resource for Bergen County
          </p>

          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="#suggest" className="text-gold hover:text-gold-bright transition-colors">
              Suggest a Gemach
            </a>
            <span className="text-cream/20">|</span>
            <a href="#top" className="text-cream/50 hover:text-cream transition-colors">
              Back to top
            </a>
          </div>

          <p className="text-xs text-cream/30 max-w-lg mx-auto">
            Data is community-sourced. Contact info may change. Please verify before visiting.
          </p>
        </div>
      </div>
    </footer>
  )
}
