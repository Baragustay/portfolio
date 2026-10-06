import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { VideoTile } from '../data/workItems'
import { posterFor } from '../lib/video'

// Full "watch it properly" experience for the two motion-graphics tiles:
// the grid's own <video> stays muted/looped/ambient — this is a separate,
// independent <video> instance with sound, opened by a click/tap (which is
// exactly the kind of user gesture browsers require before allowing
// unmuted autoplay).
//
// A real modal dialog for screen readers and keyboard users: announced
// with its video's title, focus moves to "Close" on open, Tab cycles
// only between the dialog's own controls (Close + the video's native
// controls), and focus returns to whatever opened it once it closes.
export default function VideoLightbox({ item, onClose }: { item: VideoTile; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  // Latest `onClose` without re-running the effect below — the parent
  // passes a fresh inline function each render, and re-running would
  // yank focus back to "Close" mid-use.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, video')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      opener?.focus()
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
        onClick={onClose}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute -top-10 right-0 text-base font-medium text-white/80 hover:text-white"
          >
            Close ✕
          </button>
          <video
            key={item.id}
            src={item.videoSrc}
            poster={posterFor(item.videoSrc)}
            controls
            autoPlay
            playsInline
            className="w-full rounded-2xl shadow-2xl"
          />
          <p className="mt-3 text-center text-lg text-white/70">
            {item.role} · {item.title}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
