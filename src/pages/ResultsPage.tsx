import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight, Download, Share2, RefreshCw, Star, ChevronDown, ChevronUp, PieChart, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  const location = useLocation();
  const { user } = useAuth();
  const [results, setResults] = useState<ResultData | null>(null);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, we would fetch results from the API if they're not in location state
    if (location.state?.results) {
      setResults(location.state.results);
      setLoading(false);
    } else {
      // For demo purposes, let's load mock data
      import('../data/mockResults').then(module => {
        setResults(module.default);
        setLoading(false);
      });
    }
  }, [location]);
  
  const toggleExpandPath = (index: number) => {
    setExpandedPath(expandedPath === index ? null : index);
  };
  
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-700 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-slate-700">Analyzing your results...</p>
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
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <PieChart className="h-5 w-5 text-violet-500 mr-2" />
                          <h4 className="font-medium">Salary Range</h4>
                        </div>
                        <p className="text-slate-700">{career.salary}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <GraduationCap className="h-5 w-5 text-violet-500 mr-2" />
                          <h4 className="font-medium">Education</h4>
                        </div>
                        <p className="text-slate-700">{career.education}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center mb-2">
                          <Briefcase className="h-5 w-5 text-violet-500 mr-2" />
                          <h4 className="font-medium">Job Growth</h4>
                        </div>
                        <p className="text-slate-700">{career.growth}</p>
                      </div>
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
          
          <button className="btn-secondary flex items-center">
            <Download className="mr-2 h-5 w-5" />
            Download Results
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