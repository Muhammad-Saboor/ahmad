import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Download, Share2, RefreshCw, Star, ChevronDown, ChevronUp, PieChart, Briefcase, User, FileText, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CareerRoadmap from '../components/CareerRoadmap';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAssessmentResults, generateAndDownloadPDF } from '../services/apiClient';

interface CareerPath {
  title: string;
  description: string;
  match: number;
  salary: string;
  growth: string;
  education: string;
  skills: string[];
}

interface ResultData {
  careerPaths: CareerPath[];
  strengths: string[];
  interests: string[];
  values: string[];
  personalityType: string;
  personalityDescription: string;
}

const ResultsPage = () => {
  const { user } = useAuth();
  const [expandedPath, setExpandedPath] = useState<number | null>(null);

  // PDF download mutation
  const downloadPdfMutation = useMutation({
    mutationFn: generateAndDownloadPDF,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CareerAssessment_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try again.');
    },
  });

  // Fetch AI-generated assessment results
  const { data: assessment, isLoading: loading, error } = useQuery({
    queryKey: ['/api/assessment/results'],
    queryFn: getAssessmentResults,
    enabled: !!user,
  });

  const results = assessment?.results;
  
  const toggleExpandPath = (index: number) => {
    setExpandedPath(expandedPath === index ? null : index);
  };
  
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-700 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-slate-700">Loading your AI-generated results...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Results</h2>
          <p className="text-slate-600 mb-6">Unable to load your assessment results. Please try taking the assessment again.</p>
          <Link to="/survey" className="btn-primary">
            Retake Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }
  
  if (!results) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-orange-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Results Not Found</h2>
          <p className="text-slate-600 mb-6">We couldn't find your assessment results. Please take the assessment to see your personalized career recommendations.</p>
          <Link to="/survey" className="btn-primary">
            Take Assessment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Career Path Results</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Based on your responses, we've analyzed the perfect career paths for you
          </p>
        </div>
        
        {/* Top Career Matches */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Top Career Matches
          </h2>
          
          <div className="space-y-4">
            {results.careerPaths.map((career, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className={`p-4 md:p-6 cursor-pointer ${
                    expandedPath === index ? 'bg-violet-50' : 'bg-white hover:bg-slate-50'
                  }`}
                  onClick={() => toggleExpandPath(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                        style={{
                          background: `conic-gradient(#6D28D9 ${career.match}%, #e5e7eb ${career.match}% 100%)`
                        }}
                      >
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                          <span className="text-xs font-medium">{career.match}%</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold">{career.title}</h3>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="hidden md:block text-right mr-4">
                        <div className="text-sm font-medium">{career.salary}</div>
                        <div className="text-xs text-slate-500">avg. salary</div>
                      </div>
                      
                      {expandedPath === index ? (
                        <ChevronUp className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedPath === index && (
                  <div className="p-4 md:p-6 border-t bg-violet-50 slide-up">
                    <p className="text-slate-700 mb-4">{career.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <Link to="/roadmap" className="block">
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 p-4 rounded-lg shadow-sm transition-all cursor-pointer border border-violet-200">
                          <div className="flex items-center mb-2">
                            <MapPin className="h-5 w-5 text-violet-600 mr-2" />
                            <h4 className="font-medium text-violet-700">Career Roadmap</h4>
                          </div>
                          <p className="text-violet-900 text-sm">View detailed steps to reach this career</p>
                          <ArrowRight className="h-4 w-4 text-violet-600 mt-2" />
                        </div>
                      </Link>
                      
                      <Link to="/education-form" className="block">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 p-4 rounded-lg shadow-sm transition-all cursor-pointer border border-blue-200">
                          <div className="flex items-center mb-2">
                            <User className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="font-medium text-blue-700">Education Profile</h4>
                          </div>
                          <p className="text-blue-900 text-sm">Complete your educational details</p>
                          <ArrowRight className="h-4 w-4 text-blue-600 mt-2" />
                        </div>
                      </Link>
                      
                      <Link to="/job-application" className="block">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 p-4 rounded-lg shadow-sm transition-all cursor-pointer border border-green-200">
                          <div className="flex items-center mb-2">
                            <FileText className="h-5 w-5 text-green-600 mr-2" />
                            <h4 className="font-medium text-green-700">Job Application</h4>
                          </div>
                          <p className="text-green-900 text-sm">Build your job application profile</p>
                          <ArrowRight className="h-4 w-4 text-green-600 mt-2" />
                        </div>
                      </Link>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Personality Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 col-span-3 md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Your Personality Type</h2>
            <div className="text-center py-4">
              <div className="h-32 w-32 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-violet-700">{results.personalityType}</span>
              </div>
              <p className="text-slate-600">{results.personalityDescription}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 col-span-3 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-violet-700">Key Strengths</h3>
                <ul className="space-y-2">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-violet-100 rounded-full mr-2 flex-shrink-0"></span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-teal-700">Interests</h3>
                <ul className="space-y-2">
                  {results.interests.map((interest, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-teal-100 rounded-full mr-2 flex-shrink-0"></span>
                      <span>{interest}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-orange-700">Work Values</h3>
                <ul className="space-y-2">
                  {results.values.map((value, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block h-5 w-5 bg-orange-100 rounded-full mr-2 flex-shrink-0"></span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/survey" className="btn-outline flex items-center">
            <RefreshCw className="mr-2 h-5 w-5" />
            Retake Assessment
          </Link>
          
          <button 
            onClick={() => downloadPdfMutation.mutate()}
            disabled={downloadPdfMutation.isPending}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadPdfMutation.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="mr-2 h-5 w-5" />
            )}
            {downloadPdfMutation.isPending ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
          
          <button className="btn-outline flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;