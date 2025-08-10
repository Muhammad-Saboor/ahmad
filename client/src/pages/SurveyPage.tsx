import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader } from 'lucide-react';
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
    setProgress(((currentStep) / (totalQuestions)) * 100);
  }, [currentStep, totalQuestions]);
  
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
    
    try {
      setIsSubmitting(true);
      
      const result = await submitSurveyResponses(responses, user!.id);
      
      // Navigate to results page with the data
      // Store results in sessionStorage for now
      sessionStorage.setItem('assessmentResults', JSON.stringify(result));
      setLocation('/results');
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('There was an error submitting your survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderQuestion = () => {
    if (currentStep === totalQuestions) {
      // Review step
      return (
        <div className="slide-up">
          <h3 className="text-2xl font-bold mb-6">Review Your Responses</h3>
          <div className="space-y-6">
            {surveyQuestions.map((question, index) => {
              const response = getCurrentResponse(question.id);
              return (
                <div key={question.id} className="card p-6">
                  <h4 className="text-lg font-medium mb-2">
                    {index + 1}. {question.text}
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
              disabled={isSubmitting}
              className="btn-primary flex items-center"
            >
              {isSubmitting ? 'Analyzing Results...' : 'Submit Responses'}
              {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </div>
      );
    }
    
    const question = surveyQuestions[currentStep];
    const response = getCurrentResponse(question.id);
    
    return (
      <div className="slide-up">
        <div className="mb-8">
          <span className="text-sm font-medium text-slate-500">
            Question {currentStep + 1} of {totalQuestions}
          </span>
          <h3 className="text-2xl font-bold mt-1">{question.text}</h3>
          {question.description && (
            <p className="mt-2 text-slate-600">{question.description}</p>
          )}
        </div>
        
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label 
                key={option} 
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  response === option ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={response === option}
                    onChange={() => handleResponseChange(question.id, option)}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-slate-300"
                  />
                  <span className="ml-3">{option}</span>
                </div>
              </label>
            ))}
          </div>
        )}
        
        {question.type === 'checkbox' && (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const selected = Array.isArray(response) && response.includes(option);
              
              return (
                <label 
                  key={option} 
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selected ? 'border-violet-500 bg-violet-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={`question-${question.id}`}
                      value={option}
                      checked={selected}
                      onChange={() => {
                        const currentResponse = Array.isArray(response) ? [...response] : [];
                        
                        if (selected) {
                          const filteredResponse = currentResponse.filter(item => item !== option);
                          handleResponseChange(question.id, filteredResponse);
                        } else {
                          handleResponseChange(question.id, [...currentResponse, option]);
                        }
                      }}
                      className="h-4 w-4 text-violet-600 focus:ring-violet-500 rounded border-slate-300"
                    />
                    <span className="ml-3">{option}</span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
        
        {question.type === 'scale' && (
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500">{question.scaleLabels?.[0]}</span>
              <span className="text-sm text-slate-500">{question.scaleLabels?.[1]}</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleResponseChange(question.id, value.toString())}
                  className={`py-3 border-2 rounded-lg transition-all ${
                    response === value.toString() 
                      ? 'border-violet-500 bg-violet-50 text-violet-700 font-medium' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {question.type === 'text' && (
          <div className="mt-4">
            <textarea
              value={response as string}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className="input-field h-32 resize-none"
              placeholder="Type your answer here..."
            ></textarea>
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`btn-outline flex items-center ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="btn-primary flex items-center"
          >
            {currentStep === totalQuestions - 1 ? 'Review Answers' : 'Next Question'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full">
            <div 
              className="h-full bg-violet-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {renderQuestion()}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;