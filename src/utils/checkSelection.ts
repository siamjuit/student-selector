import { supabase } from '../lib/supabaseClient';
import { SelectionResult } from '../types';

export async function checkSelection(email: string): Promise<SelectionResult> {
  try {
    // Simulate network delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data, error } = await supabase
      .from('selected_students')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return { selected: false, error: error.message };
    }

    return { selected: data && data.length > 0 };
  } catch (error) {
    console.error('Selection check error:', error);
    return { selected: false, error: 'Network error occurred' };
  }
}