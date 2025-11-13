import { motion } from 'framer-motion'

export function AnimationMove({ animKey, children, className }: { animKey: string, children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      key={animKey}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
