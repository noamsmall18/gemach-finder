import { Heart } from 'lucide-react'

interface FooterProps {
  gemachCount: number
}

export default function Footer({ gemachCount }: FooterProps) {
  return (
    <footer className="bg-navy text-cream/90 py-10 px-4 mt-8">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-1.5 text-sm">
          <span>{gemachCount} gemachs listed</span>
          <Heart className="w-3.5 h-3.5 text-gold fill-gold" />
        </div>

        <p className="text-sm text-cream/60">
          Built by Noam Small as a community resource for Bergen County
        </p>

        <div className="flex items-center justify-center gap-4 text-sm">
          <a href="#suggest" className="text-gold hover:text-gold-bright transition-colors">
            Suggest a Gemach
          </a>
          <span className="text-cream/30">|</span>
          <a href="#top" className="text-cream/60 hover:text-cream transition-colors">
            Back to top
          </a>
        </div>

        <p className="text-xs text-cream/40 max-w-lg mx-auto">
          Data is community-sourced. Contact info may change. Please verify before visiting.
        </p>
      </div>
    </footer>
  )
}
