import React from 'react';
import { motion } from 'framer-motion';

interface GraffitiTextProps {
  text: string;
  type: 'success' | 'failure' | 'error';
  className?: string;
}

export const GraffitiText: React.FC<GraffitiTextProps> = ({ text, type, className = '' }) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          primary: 'text-green-400',
          shadow: 'text-green-600',
          glow: 'rgba(34, 197, 94, 0.8)',
        };
      case 'failure':
        return {
          primary: 'text-red-400',
          shadow: 'text-red-600',
          glow: 'rgba(239, 68, 68, 0.8)',
        };
      case 'error':
        return {
          primary: 'text-yellow-400',
          shadow: 'text-yellow-600',
          glow: 'rgba(251, 191, 36, 0.8)',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`relative ${className}`}>
      {/* Shadow layer */}
      <motion.pre
        className={`font-mono text-sm ${colors.shadow} absolute`}
        style={{ 
          transform: 'translate(2px, 2px)',
          filter: 'blur(1px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.1 }}
      >
        {text}
      </motion.pre>

      {/* Main text */}
      <motion.pre
        className={`font-mono text-sm ${colors.primary} relative z-10`}
        style={{
          filter: `drop-shadow(0 0 10px ${colors.glow})`,
        }}
        initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotateX: 0,
        }}
        transition={{ 
          duration: 0.6,
          ease: "backOut",
        }}
      >
        {text}
      </motion.pre>

      {/* Spray texture overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${colors.glow} 0%, transparent 50%), 
                      radial-gradient(circle at 80% 70%, ${colors.glow} 0%, transparent 30%)`,
          mixBlendMode: 'multiply',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.3 }}
      />
    </div>
  );
};