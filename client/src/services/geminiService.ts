import { assessmentApi } from './apiClient';

export const submitSurveyResponses = async (responses: any[], userId: number): Promise<any> => {
  try {
    // Submit survey responses to the API
    const results = await assessmentApi.submitSurvey(responses);
    return results;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw error;
  }
};