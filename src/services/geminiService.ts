import { supabase } from './supabaseClient';
import type { Assessment } from './supabaseClient';

export const submitSurveyResponses = async (responses: any[], userId: string): Promise<any> => {
  try {
    // Create a new assessment record
    const { data: assessment, error: createError } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          responses: responses,
          completed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (createError) throw createError;

    // For now, we'll use mock results
    // In a real application, this would make a call to the Gemini API
    const mockResults = await import('../data/mockResults');
    const results = mockResults.default;

    // Update the assessment with the results
    const { error: updateError } = await supabase
      .from('assessments')
      .update({ results })
      .eq('id', assessment.id);

    if (updateError) throw updateError;

    return results;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};