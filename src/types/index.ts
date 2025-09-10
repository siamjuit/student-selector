export interface CommandHistory {
  command: string;
  output: string | JSX.Element;
  timestamp: Date;
}

export interface SelectionResult {
  selected: boolean;
  error?: string;
}

export interface AgentState {
  isActive: boolean;
  message: string;
  position: { x: number; y: number };
}

export interface TerminalState {
  currentInput: string;
  history: CommandHistory[];
  isProcessing: boolean;
  agentState: AgentState;
  soundEnabled: boolean;
}