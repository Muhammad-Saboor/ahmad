import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateQuestions, submitSurvey } from '../services/apiClient';

interface SurveyResponse {
  questionId: number;
  question: string;
  answer: string | string[];
}

interface CareerQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  category: string;
}

const SurveyPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [progress, setProgress] = useState(0);
  
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch AI-generated questions
  const { data: questionsData, isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ['/api/survey/questions'],
    queryFn: generateQuestions,
    enabled: !!user,
  });

  const questions: CareerQuestion[] = questionsData?.questions || [];
  const totalQuestions = questions.length;

  useEffect(() => {
    if (totalQuestions > 0) {
      setProgress(((currentStep) / (totalQuestions + 1)) * 100);
    }
  }, [currentStep, totalQuestions]);

  // Submit survey mutation
  const submitMutation = useMutation({
    mutationFn: submitSurvey,
    onSuccess: (result) => {
      // Invalidate assessment queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['/api/assessment/results'] });
      
      // Navigate to results page
      setLocation('/results');
    },
    onError: (error) => {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
    },
  });

  const handleNext = () => {
    if (currentStep < totalQuestions) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleResponseChange = (questionId: number, question: string, answer: string | string[]) => {
    setResponses(prev => {
      const existingResponseIndex = prev.findIndex(r => r.questionId === questionId);
      
      if (existingResponseIndex >= 0) {
        const newResponses = [...prev];
        newResponses[existingResponseIndex] = { questionId, question, answer };
        return newResponses;
      } else {
        return [...prev, { questionId, question, answer }];
      }
    });
  };

  const getCurrentResponse = (questionId: number) => {
    return responses.find(r => r.questionId === questionId)?.answer || '';
  };

  const handleSubmit = async () => {
    if (responses.length < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }
    
    submitMutation.mutate(responses);
  };

  const renderQuestionContent = (question: CareerQuestion) => {
    const currentResponse = getCurrentResponse(question.id);

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={currentResponse === option}
                  onChange={(e) => handleResponseChange(question.id, question.question, e.target.value)}
                  className="mr-3 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Strongly Disagree</span>
              <span>Strongly Agree</span>
            </div>
            <div className="flex justify-between space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="flex flex-col items-center cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={value.toString()}
                    checked={currentResponse === value.toString()}
                    onChange={(e) => handleResponseChange(question.id, question.question, e.target.value)}
                    className="mb-2 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium">{value}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={currentResponse as string}
            onChange={(e) => handleResponseChange(question.id, question.question, e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="Please share your thoughts..."
          />
        );

      default:
        return null;
    }
  };

  const renderQuestion = () => {
    if (currentStep === totalQuestions) {
      // Review step
      return (
        <div className="slide-up">
          <h3 className="text-2xl font-bold mb-6">Review Your Responses</h3>
          <div className="space-y-6">
            {questions.map((question, index) => {
              const response = getCurrentResponse(question.id);
              return (
                <div key={question.id} className="bg-white p-6 rounded-lg border">
                  <h4 className="text-lg font-medium mb-2">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="pl-6 flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      {Array.isArray(response) ? (
                        <ul className="list-disc pl-5">
                          {response.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700">{response}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-between">
            <button 
              onClick={handlePrevious}
              className="btn-outline flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  Analyzing Results...
                </>
              ) : (
                <>
                  Submit Responses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      );
    }
    
    const question = questions[currentStep];
    if (!question) return null;

    return (
      <div className="slide-up">
        <div className="mb-6">
          <span className="text-sm font-medium text-violet-600 uppercase tracking-wide">
            {question.category}
          </span>
          <h3 className="text-2xl font-bold mt-2 mb-4">
            {question.question}
          </h3>
        </div>
        
        {renderQuestionContent(question)}
        
        <div className="mt-8 flex justify-between">
          <button 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
            className="btn-outline flex items-center disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </button>
          
          <button 
            onClick={handleNext}
            disabled={!getCurrentResponse(question.id)}
            className="btn-primary flex items-center disabled:opacity-50"
          >
            {currentStep === totalQuestions - 1 ? 'Review' : 'Next'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (questionsLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-violet-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Generating Your Personalized Assessment
          </h2>
          <p className="text-slate-600">
            Our AI is creating questions tailored specifically for you...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (questionsError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Unable to Load Assessment
          </h2>
          <p className="text-slate-600 mb-6">
            There was an issue generating your assessment questions. Please try again.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-violet-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {Math.min(currentStep + 1, totalQuestions)} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-violet-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
          {renderQuestion()}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Answer honestly for the most accurate career recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;