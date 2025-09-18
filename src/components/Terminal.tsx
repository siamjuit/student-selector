import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '../hooks/useTerminal';
import { Agent } from './Agent';
import { TypewriterText } from './TypewriterText';
import { WarpEffect } from './WarpEffect';
import { GraffitiText } from './GraffitiText';
import { ConfettiEffect } from './ConfettiEffect';
import { SIAM_JUIT_LOGO, SUCCESS_GRAFFITI, FAILURE_GRAFFITI, ERROR_404_GRAFFITI } from '../utils/asciiArt';
import { WHATSAPP_INVITE_URL } from '../config/constants';
import { WHATSAPP_INVITE_URL2 } from '../config/constants';
import { Volume2, VolumeX } from 'lucide-react';

export const Terminal: React.FC = () => {
  const { state, setState, executeCommand, navigateHistory, autocomplete, inputRef, clearHistory } = useTerminal();
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showWarp, setShowWarp] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.history]);

  // Keyboard event handlers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (state.currentInput.trim() && !state.isProcessing) {
          executeCommand(state.currentInput);
          setState(prev => ({ ...prev, currentInput: '' }));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigateHistory('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateHistory('down');
        break;
      case 'Tab':
        e.preventDefault();
        autocomplete();
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          clearHistory();
        }
        break;
    }
  };

  // Handle processing state changes
  useEffect(() => {
    if (state.isProcessing) {
      const timer = setTimeout(() => {
        setShowWarp(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.isProcessing]);

  const renderHistoryOutput = (output: string | JSX.Element, index: number) => {
    if (React.isValidElement(output)) {
      return output;
    }

    const outputStr = output as string;

    // Success state
    if (outputStr === 'success') {
      setTimeout(() => setShowConfetti(true), 500);
      return (
        <motion.div
          key={`success-${index}`}
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GraffitiText text={SUCCESS_GRAFFITI} type="success" className="mb-6" />
          
          <motion.div
            className="bg-gradient-to-r from-green-800 to-green-900 border border-green-500 rounded-lg p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 font-bold text-lg">CONGRATULATIONS!</span>
            </div>
            
            <p className="text-green-200 mb-4">
              You've been selected! Join our exclusive WhatsApp group to connect with other selected students.
            </p>
            
            <motion.a
              href={WHATSAPP_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join WhatsApp Group →
            </motion.a>
            
            <div className="mt-4 flex items-center text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Selected Student</span>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // Failure state
    if (outputStr === 'failure') {
      return (
        <motion.div
          key={`failure-${index}`}
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GraffitiText 
            text={FAILURE_GRAFFITI} 
            type="failure" 
            className="mb-6" 
          />
          
          <motion.div
            className="bg-gradient-to-r from-red-800 to-red-900 border-red-500 border rounded-lg p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl">😢</span>
              <span className="text-red-300 font-bold text-lg">
                BETTER LUCK NEXT TIME
              </span>
            </div>
            
            <p className="text-red-200 mb-4">
              Don't worry though! You will have a chance to try again. Join the updates (if you haven't) group for future opportunities.
            </p>
            <motion.a
              href={WHATSAPP_INVITE_URL2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join WhatsApp Group →
            </motion.a>
            <div className="mt-4 text-sm text-red-300">
              💡 Tip: Stay active in college activities and maintain good academic performance!
            </div>
          </motion.div>

          {/* Rain effect for failure */}
          <div className="fixed inset-0 pointer-events-none z-30">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-400 opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: -30,
                }}
                animate={{
                  y: window.innerHeight + 50,
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      );
    }

    // Error state
    if (outputStr.startsWith('error:')) {
      return (
        <motion.div
          key={`error-${index}`}
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GraffitiText 
            text={ERROR_404_GRAFFITI} 
            type="error" 
            className="mb-6" 
          />
          
          <motion.div
            className="bg-gradient-to-r from-yellow-800 to-yellow-900 border-yellow-500 border rounded-lg p-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl">😢</span>
              <span className="text-yellow-300 font-bold text-lg">
                SYSTEM ERROR
              </span>
            </div>
            
            <p className="text-yellow-200 mb-4">
              There was an issue checking your selection status. Please try again later.
            </p>
            
            <div className="mt-4 text-sm text-yellow-300">
               That's on us.(Or maybe you're just late.)
            </div>
          </motion.div>
        </motion.div>
      );
    }

    // Processing states with typewriter effect
    if (outputStr === 'processing...' || outputStr === 'checking...' || outputStr.includes('trying to check')) {
      return (
        <div key={`processing-${index}`} className="text-green-400">
          <TypewriterText text={outputStr} speed={30} />
        </div>
      );
    }

    // Regular output
    return (
      <pre key={index} className="text-green-300 whitespace-pre-wrap font-mono text-sm">
        {outputStr}
      </pre>
    );
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix-style background effect */}
      <div className="fixed inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs text-green-500"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
            }}
            animate={{
              y: window.innerHeight + 20,
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            {Math.random().toString(36).substring(2, 15)}
          </motion.div>
        ))}
      </div>

      {/* Sound toggle */}
      <motion.button
        className="fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-green-400 p-2 rounded-lg transition-colors"
        onClick={() => setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {state.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>

      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="h-screen overflow-y-auto p-6 pb-20 relative z-10"
      >
        {/* ASCII Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <pre className="text-green-500 text-xs leading-tight">
            {SIAM_JUIT_LOGO}
          </pre>
          <motion.div
            className="mt-4 text-green-300 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <TypewriterText 
              text="Welcome to the SIAM JUIT Selection Portal"
              speed={50}
            />
          </motion.div>
          <motion.div
            className="mt-2 text-green-500 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <TypewriterText 
              text="Type 'help' to see available commands"
              speed={40}
            />
          </motion.div>
        </motion.div>

        {/* Command History */}
        <AnimatePresence mode="popLayout">
          {state.history.map((entry, index) => (
            <motion.div
              key={index}
              className="mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {entry.command && (
                <div className="text-green-400 mb-1">
                  {entry.command}
                </div>
              )}
              {entry.output && renderHistoryOutput(entry.output, index)}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Input */}
        <div className="flex items-center text-green-400">
          <span className="mr-2">user@siam-juit:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={state.currentInput}
            onChange={(e) => setState(prev => ({ ...prev, currentInput: e.target.value }))}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 text-green-400 caret-green-400"
            disabled={state.isProcessing}
            autoFocus
            spellCheck={false}
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-green-400 ml-1"
          >
            ▋
          </motion.span>
        </div>
      </div>

      {/* Effects */}
      <Agent state={state.agentState} />
      <WarpEffect 
        isActive={showWarp} 
        onComplete={() => setShowWarp(false)} 
      />
      <ConfettiEffect 
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
};