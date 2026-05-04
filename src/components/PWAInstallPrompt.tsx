'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Download, Share2 } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'gf_pwa_dismissed_at'
const DISMISS_DAYS = 30

type InstallMode = 'prompt' | 'ios'

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean
}

function isIosBrowser() {
  const ua = window.navigator.userAgent.toLowerCase()
  return /iphone|ipad|ipod/.test(ua) || (ua.includes('mac') && window.navigator.maxTouchPoints > 1)
}

function isStandaloneDisplayMode() {
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true
}

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<InstallMode | null>(null)
  const [showIosHelp, setShowIosHelp] = useState(false)

  useEffect(() => {
    if (isStandaloneDisplayMode()) return

    const recent = localStorage.getItem(DISMISS_KEY)
    if (recent) {
      const age = Date.now() - Number(recent)
      if (age < DISMISS_DAYS * 24 * 60 * 60 * 1000) return
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => undefined)
    }

    let shown = false
    const showPrompt = (nextMode: InstallMode, delayMs = 6000) => {
      if (shown) return
      shown = true
      window.setTimeout(() => {
        setMode(nextMode)
        setVisible(true)
      }, delayMs)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      showPrompt('prompt')
    }
    window.addEventListener('beforeinstallprompt', handler)

    const installedHandler = () => {
      setVisible(false)
      setDeferred(null)
      setMode(null)
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    }
    window.addEventListener('appinstalled', installedHandler)

    if (isIosBrowser()) {
      showPrompt('ios', 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  function dismiss() {
    setVisible(false)
    setShowIosHelp(false)
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }

  async function install() {
    if (mode === 'ios') {
      setShowIosHelp((current) => !current)
      return
    }

    if (!deferred) return

    await deferred.prompt()
    await deferred.userChoice
    setVisible(false)
    setDeferred(null)
    setMode(null)
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }

  if (!visible || !mode) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-80 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 flex items-start gap-3">
        <Image src="/logo.png" alt="" width={36} height={36} className="w-9 h-9 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-heading font-bold text-sm text-slate-800">Install GemachFinder</div>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">
            {mode === 'prompt'
              ? 'Add to your home screen for one-tap access.'
              : 'Add this app to your home screen so it opens like a native app.'}
          </p>
          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={install}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-semibold hover:bg-navy/90 transition-colors"
            >
              {mode === 'prompt' ? <Download className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {mode === 'prompt' ? 'Install' : 'How to install'}
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Not now
            </button>
          </div>
          {mode === 'ios' && showIosHelp && (
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              Tap the Share button in Safari, then choose Add to Home Screen.
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
