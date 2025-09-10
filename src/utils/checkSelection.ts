import { supabase } from '../lib/supabaseClient';
import { SelectionResult } from '../types';

export async function checkSelection(email: string): Promise<SelectionResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log('🔍 Searching for email:', normalizedEmail);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { data, error } = await supabase
      .from('selected_students')
      .select('*') // Select all fields temporarily for debugging
      .eq('email', normalizedEmail);
    
    console.log('📊 Supabase response:', { data, error });
    console.log('📝 Data length:', data?.length);
    console.log('💾 Raw data:', JSON.stringify(data, null, 2));
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return { selected: false, error: error.message };
    }
    
    const isSelected = data && data.length > 0;
    console.log('✅ Final result - selected:', isSelected);
    
    return { selected: isSelected };
  } catch (error) {
    console.error('💥 Selection check error:', error);
    return { selected: false, error: 'Network error occurred' };
  }
}