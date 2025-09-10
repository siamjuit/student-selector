import { useState, useCallback, useRef, useEffect } from 'react';
import { TerminalState, CommandHistory } from '../types';
import { COMMANDS } from '../config/constants';
import { checkSelection } from '../utils/checkSelection';

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    currentInput: '',
    history: [],
    isProcessing: false,
    agentState: {
      isActive: false,
      message: '',
      position: { x: 0, y: 0 },
    },
    soundEnabled: true,
  });

  const historyIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToHistory = useCallback((command: string, output: string | JSX.Element) => {
    setState(prev => ({
      ...prev,
      history: [...prev.history, {
        command,
        output,
        timestamp: new Date(),
      }],
    }));
  }, []);

  const setAgentState = useCallback((agentState: Partial<typeof state.agentState>) => {
    setState(prev => ({
      ...prev,
      agentState: { ...prev.agentState, ...agentState },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  const setProcessing = useCallback((isProcessing: boolean) => {
    setState(prev => ({ ...prev, isProcessing }));
  }, []);

  const executeCommand = useCallback(async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (!trimmedCommand) return;

    // Add command to history
    addToHistory(`user@siam-juit:~$ ${command}`, '');

    if (trimmedCommand === COMMANDS.HELP) {
      addToHistory('', `Available commands:
  help                    - Show this help message
  clear                   - Clear the terminal
  amiselected <email>     - Check if an email is selected

Example:
  amiselected john@juitsolan.in

Keyboard shortcuts:
  Ctrl+L or 'clear'       - Clear terminal
  Up/Down arrows          - Command history
  Tab                     - Autocomplete commands`);
    } 
    else if (trimmedCommand === COMMANDS.CLEAR) {
      clearHistory();
    } 
    else if (trimmedCommand.startsWith(COMMANDS.AMISELECTED)) {
      const emailMatch = command.match(/amiselected\s+(.+)/i);
      if (!emailMatch) {
        addToHistory('', 'Error: Please provide an email address');
        return;
      }

      const email = emailMatch[1].trim();
      if (!email.includes('@')) {
        addToHistory('', 'Error: Please provide a valid email address');
        return;
      }

      // Start the dramatic sequence
      setProcessing(true);
      
      // Agent appears
      setAgentState({
        isActive: true,
        message: 'Initiating scan...',
        position: { 
          x: window.innerWidth * 0.3, 
          y: window.innerHeight * 0.3 
        },
      });

      // Processing phase
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToHistory('', 'processing...');
      
      // Checking phase
      await new Promise(resolve => setTimeout(resolve, 800));
      setAgentState({ message: 'Accessing database...' });
      addToHistory('', 'checking...');

      // Taste check phase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAgentState({ 
        message: 'Analyzing snack preferences...',
        position: { 
          x: window.innerWidth * 0.7, 
          y: window.innerHeight * 0.4 
        },
      });
      addToHistory('', 'trying to check if you have good tastes in snack...');

      // Actual database check
      const result = await checkSelection(email);
      
      // Hide agent
      setAgentState({ isActive: false });
      setProcessing(false);

      // Show result
      if (result.selected) {
        addToHistory('', 'success');
      } else {
        addToHistory('', result.error ? `error: ${result.error}` : 'failure');
      }
    } 
    else {
      addToHistory('', `Command not found: ${trimmedCommand}. Type 'help' for available commands.`);
    }
  }, [addToHistory, clearHistory, setProcessing, setAgentState]);

  const navigateHistory = useCallback((direction: 'up' | 'down') => {
    const commands = state.history.filter(h => h.command.startsWith('user@')).map(h => h.command.replace('user@siam-juit:~$ ', ''));
    
    if (commands.length === 0) return;

    if (direction === 'up') {
      historyIndex.current = Math.max(0, historyIndex.current === -1 ? commands.length - 1 : historyIndex.current - 1);
    } else {
      historyIndex.current = historyIndex.current === commands.length - 1 ? -1 : historyIndex.current + 1;
    }

    const command = historyIndex.current === -1 ? '' : commands[historyIndex.current];
    setState(prev => ({ ...prev, currentInput: command }));
  }, [state.history]);

  const autocomplete = useCallback(() => {
    const input = state.currentInput.toLowerCase();
    const commands = Object.values(COMMANDS);
    const matches = commands.filter(cmd => cmd.startsWith(input));
    
    if (matches.length === 1) {
      setState(prev => ({ ...prev, currentInput: matches[0] }));
    }
  }, [state.currentInput]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    state,
    setState,
    executeCommand,
    navigateHistory,
    autocomplete,
    inputRef,
    clearHistory,
  };
};