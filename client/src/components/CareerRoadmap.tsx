import { CheckCircle, Circle, MapPin, Calendar, Book, Award } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  timeframe: string;
  completed?: boolean;
  type: 'education' | 'experience' | 'skill' | 'certification';
}

interface CareerRoadmapProps {
  careerTitle: string;
  steps: RoadmapStep[];
}

const CareerRoadmap = ({ careerTitle, steps }: CareerRoadmapProps) => {
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <Book className="h-5 w-5" />;
      case 'experience':
        return <MapPin className="h-5 w-5" />;
      case 'skill':
        return <Award className="h-5 w-5" />;
      case 'certification':
        return <Award className="h-5 w-5" />;
      default:
        return <Circle className="h-5 w-5" />;
    }
  };

  const getStepColor = (type: string, completed: boolean = false) => {
    if (completed) return 'text-green-600 bg-green-100';
    
    switch (type) {
      case 'education':
        return 'text-blue-600 bg-blue-100';
      case 'experience':
        return 'text-purple-600 bg-purple-100';
      case 'skill':
        return 'text-orange-600 bg-orange-100';
      case 'certification':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="flex items-center mb-6">
        <MapPin className="h-6 w-6 text-violet-600 mr-3" />
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{careerTitle} Roadmap</h3>
          <p className="text-slate-600 text-sm">Your personalized career development path</p>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-200"></div>
            )}
            
            <div className="flex items-start space-x-4">
              {/* Step indicator */}
              <div className={`p-3 rounded-full ${getStepColor(step.type, step.completed)}`}>
                {step.completed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  getStepIcon(step.type)
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${step.completed ? 'text-green-700' : 'text-slate-900'}`}>
                    {step.title}
                  </h4>
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {step.timeframe}
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
                {step.completed && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-violet-50 rounded-lg">
        <p className="text-sm text-violet-700">
          <strong>Pro Tip:</strong> Focus on one step at a time and track your progress. 
          Each completed step brings you closer to your career goals!
        </p>
      </div>
    </div>
  );
};

export default CareerRoadmap;