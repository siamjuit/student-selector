# SIAM JUIT Selection CLI App

A theatrical terminal-style React app for checking student selection status with dramatic Framer Motion animations and direct Supabase integration.

## Features

- 🎭 **Theatrical CLI Interface**: Dark terminal aesthetic with animated sequences
- 🤖 **Agent Persona**: Floating AI agent with micro-interactions during processing  
- ⚡ **Dramatic Animations**: Warp effects, graffiti text, confetti celebrations
- 📱 **WhatsApp Integration**: Direct invite links for selected students
- ♿ **Accessibility**: Screen reader support, keyboard navigation, reduced motion
- 🔍 **Real-time Database**: Direct Supabase integration for selection checking

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=your-supabase-project-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key  
# VITE_WHATSAPP_URL=https://chat.whatsapp.com/your-invite-link

# Start development server
npm run dev
```

## Terminal Commands

- `help` - Show available commands
- `clear` - Clear terminal output (or Ctrl+L)
- `amiselected <email>` - Check if email is selected

## Keyboard Shortcuts

- **Up/Down arrows**: Navigate command history
- **Tab**: Autocomplete commands
- **Ctrl+L**: Clear terminal

## Supabase Setup

### 1. Create Database Table

```sql
CREATE TABLE selected_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_selected_students_email ON selected_students(email);
```

### 2. Seed Demo Data

```sql
INSERT INTO selected_students (email) VALUES ('221030303@juitsolan.in');
```

### 3. Configure Row Level Security (Recommended)

```sql
ALTER TABLE selected_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON selected_students
FOR SELECT TO anon USING (true);
```

## Customization

### Change ASCII Logo

Replace the `SIAM_JUIT_LOGO` in `src/utils/asciiArt.ts`:

```typescript
export const SIAM_JUIT_LOGO = `
Your Custom ASCII Art Here
`;
```

**Tip**: Use online ASCII generators or convert SVG/PNG to ASCII using tools like:
- [ASCII Art Generator](https://www.ascii-art-generator.org/)
- [Text to ASCII](https://patorjk.com/software/taag/)

### Update WhatsApp Invite URL

Edit the `VITE_WHATSAPP_URL` in your `.env` file:

```env
VITE_WHATSAPP_URL=https://chat.whatsapp.com/your-group-invite-link
```

### Animation Timing

Modify animation speeds in `src/config/constants.ts`:

```typescript
export const ANIMATION_TIMINGS = {
  typewriter: 50,    // Typewriter speed (ms per character)
  warp: 2000,        // Warp effect duration
  agent: 1500,       // Agent appearance duration
  result: 1000,      // Result animation duration
  confetti: 3000,    // Confetti celebration duration
};
```

## Production Security

### Option 1: Edge Function (Recommended)

Create a Supabase Edge Function to handle selection checks securely:

```typescript
// supabase/functions/check-selection/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  const { data, error } = await supabase
    .from('selected_students')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .limit(1)

  return new Response(
    JSON.stringify({ selected: data && data.length > 0 }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### Option 2: RLS Policies

For client-only checks, ensure proper Row Level Security:

```sql
-- Enable RLS
ALTER TABLE selected_students ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access
CREATE POLICY "Public read access" ON selected_students
FOR SELECT TO anon USING (true);

-- Prevent all other operations
CREATE POLICY "No insert" ON selected_students FOR INSERT TO anon USING (false);
CREATE POLICY "No update" ON selected_students FOR UPDATE TO anon USING (false);
CREATE POLICY "No delete" ON selected_students FOR DELETE TO anon USING (false);
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Considerations

- ⚠️ **Never expose service role keys** in client code
- 🔒 **Use RLS policies** for client-side database access
- 🚦 **Implement rate limiting** to prevent abuse
- 🔐 **Use Edge Functions** for production environments
- 📝 **Don't log emails** or personal information

## Admin Operations

### CSV Upload via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Select `selected_students` table  
3. Click "Insert" → "Insert via CSV"
4. Upload CSV with `email` column

### Bulk Insert via SQL

```sql
INSERT INTO selected_students (email) VALUES 
('student1@juitsolan.in'),
('student2@juitsolan.in'),
('student3@juitsolan.in');
```

## Troubleshooting

### Supabase Connection Issues

1. Verify environment variables in `.env`
2. Check Supabase project URL and keys
3. Ensure RLS policies allow public read access

### Animation Performance

- Animations respect `prefers-reduced-motion` setting
- Use sound toggle to disable audio feedback
- Check browser developer tools for performance issues

## Tech Stack

- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling  
- **Supabase** for database
- **Canvas Confetti** for celebrations
- **Vite** for build tooling

## License

MIT License - Feel free to customize for your institution!