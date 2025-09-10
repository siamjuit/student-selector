import { supabase } from '../lib/supabaseClient';
import { SelectionResult } from '../types';

export async function checkSelection(email: string): Promise<SelectionResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use ilike for case-insensitive matching
    const { data, error } = await supabase
      .from('selected_students')
      .select('*')
      .ilike('email', normalizedEmail);
    
    if (error) {
      return { selected: false, error: error.message };
    }
    
    return { selected: data && data.length > 0 };
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : 'An unexpected error occurred';
    return { selected: false, error: errorMessage };
  }
}