import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';
import { AgentState } from '../types';

interface AgentProps {
  state: AgentState;
}

export const Agent: React.FC<AgentProps> = ({ state }) => {
  return (
    <AnimatePresence>
      {state.isActive && (
        <motion.div
          className="fixed z-50"
          style={{
            left: state.position.x,
            top: state.position.y,
          }}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0],
          }}
          exit={{ opacity: 0, scale: 0, rotate: 180 }}
          transition={{ 
            duration: 0.5,
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }
          }}
        >
          <div className="relative">
            {/* Agent Avatar */}
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-2xl border-2 border-green-300"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 30px rgba(34, 197, 94, 0.8)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                ],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Bot className="text-white" size={24} />
            </motion.div>

            {/* Speech Bubble */}
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-green-400 px-4 py-2 rounded-lg shadow-lg border border-green-500 whitespace-nowrap text-sm font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {state.message}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </motion.div>

            {/* Thinking particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                style={{
                  right: -10 - i * 8,
                  top: 20,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};