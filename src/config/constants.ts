export const WHATSAPP_INVITE_URL = import.meta.env.VITE_WHATSAPP_URL || "https://chat.whatsapp.com/your-invite-link-here";

export const COMMANDS = {
  HELP: 'help',
  CLEAR: 'clear',
  AMISELECTED: 'amiselected',
} as const;

export const DEMO_EMAIL = "221030303@juitsolan.in";

export const ANIMATION_TIMINGS = {
  typewriter: 0.05,
  warp: 2000,
  agent: 1500,
  result: 1000,
  confetti: 3000,
} as const;

export const SOUNDS = {
  typing: "/sounds/typing.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
} as const;