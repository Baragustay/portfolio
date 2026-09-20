import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { VideoTile } from '../data/workItems'

// Full "watch it properly" experience for the two motion-graphics tiles:
// the grid's own <video> stays muted/looped/ambient — this is a separate,
// independent <video> instance with sound, opened by a click/tap (which is
// exactly the kind of user gesture browsers require before allowing
// unmuted autoplay).
export default function VideoLightbox({ item, onClose }: { item: VideoTile; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
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
