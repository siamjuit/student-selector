import React from 'react';
import { motion } from 'framer-motion';

interface WarpEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const WarpEffect: React.FC<WarpEffectProps> = ({ isActive, onComplete }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onComplete}
      >
        {/* Warp rings */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-green-400"
            style={{
              width: 50 + i * 50,
              height: 50 + i * 50,
              left: -(25 + i * 25),
              top: -(25 + i * 25),
            }}
            initial={{ scale: 0, opacity: 0.8, rotate: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0.8, 0.2, 0],
              rotate: 360,
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Central glow */}
        <motion.div
          className="w-20 h-20 rounded-full bg-green-400"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{
            filter: 'blur(10px)',
            boxShadow: '0 0 50px rgba(34, 197, 94, 0.8)',
          }}
        />

        {/* Scanning lines */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
              style={{
                width: '200%',
                left: '-50%',
                top: `${i * 5}%`,
              }}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};