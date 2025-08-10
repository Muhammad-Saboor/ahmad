import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import CareerRoadmap from '../components/CareerRoadmap';

const RoadmapPage = () => {
  const [selectedCareer, setSelectedCareer] = useState('Software Engineer');

  // Mock roadmap data - in a real app, this would come from your API
  const roadmapData = {
    'Software Engineer': [
      {
        id: 1,
        title: 'Learn Programming Fundamentals',
        description: 'Master the basics of programming with languages like Python, JavaScript, or Java. Focus on data structures, algorithms, and problem-solving skills.',
        timeframe: '3-6 months',
        type: 'education' as const,
        completed: true
      },
      {
        id: 2,
        title: 'Build Projects Portfolio',
        description: 'Create 3-5 personal projects showcasing different skills. Include web applications, mobile apps, or system tools that demonstrate your abilities.',
        timeframe: '4-8 months',
        type: 'experience' as const,
        completed: true
      },
      {
        id: 3,
        title: 'Learn Version Control (Git)',
        description: 'Master Git and GitHub for code collaboration and version management. Essential for any software development role.',
        timeframe: '1-2 months',
        type: 'skill' as const,
        completed: false
      },
      {
        id: 4,
        title: 'Complete Bachelor\'s Degree',
        description: 'Earn a degree in Computer Science, Software Engineering, or related field. Alternative: coding bootcamp or self-taught with strong portfolio.',
        timeframe: '4 years',
        type: 'education' as const,
        completed: false
      },
      {
        id: 5,
        title: 'Gain Internship Experience',
        description: 'Secure 1-2 internships at tech companies to gain real-world experience and professional networking opportunities.',
        timeframe: '6-12 months',
        type: 'experience' as const,
        completed: false
      },
      {
        id: 6,
        title: 'Master a Framework/Technology Stack',
        description: 'Specialize in specific technologies like React/Node.js for web development, or mobile frameworks like React Native or Flutter.',
        timeframe: '6-12 months',
        type: 'skill' as const,
        completed: false
      },
      {
        id: 7,
        title: 'Obtain Technical Certifications',
        description: 'Earn relevant certifications such as AWS Cloud Practitioner, Google Cloud Associate, or specific technology certifications.',
        timeframe: '3-6 months',
        type: 'certification' as const,
        completed: false
      },
      {
        id: 8,
        title: 'Apply for Entry-Level Positions',
        description: 'Begin applying for junior software engineer roles. Focus on companies that align with your interests and career goals.',
        timeframe: '3-6 months',
        type: 'experience' as const,
        completed: false
      }
    ],
    'Data Scientist': [
      {
        id: 1,
        title: 'Master Statistics and Mathematics',
        description: 'Build strong foundation in statistics, linear algebra, and calculus. These are essential for understanding machine learning algorithms.',
        timeframe: '6-12 months',
        type: 'education' as const,
        completed: false
      },
      {
        id: 2,
        title: 'Learn Python/R Programming',
        description: 'Master Python or R for data analysis, with focus on libraries like pandas, NumPy, scikit-learn, and matplotlib.',
        timeframe: '4-6 months',
        type: 'skill' as const,
        completed: false
      },
      {
        id: 3,
        title: 'Complete Data Science Degree/Certification',
        description: 'Earn degree in Data Science, Statistics, Mathematics, or complete comprehensive online certification program.',
        timeframe: '2-4 years',
        type: 'education' as const,
        completed: false
      },
      {
        id: 4,
        title: 'Build Data Science Portfolio',
        description: 'Create portfolio with diverse projects: predictive modeling, data visualization, machine learning applications.',
        timeframe: '6-12 months',
        type: 'experience' as const,
        completed: false
      },
      {
        id: 5,
        title: 'Learn SQL and Database Management',
        description: 'Master SQL for data extraction and manipulation. Learn database design and big data technologies like Hadoop or Spark.',
        timeframe: '3-6 months',
        type: 'skill' as const,
        completed: false
      },
      {
        id: 6,
        title: 'Gain Industry Experience',
        description: 'Secure internships or entry-level analyst positions to gain practical experience with real business problems.',
        timeframe: '6-18 months',
        type: 'experience' as const,
        completed: false
      }
    ],
    'UX Designer': [
      {
        id: 1,
        title: 'Learn Design Fundamentals',
        description: 'Master principles of visual design, color theory, typography, and composition. Understand basic design psychology.',
        timeframe: '3-6 months',
        type: 'education' as const,
        completed: false
      },
      {
        id: 2,
        title: 'Study User Experience Principles',
        description: 'Learn UX research methods, user personas, journey mapping, and usability testing techniques.',
        timeframe: '4-8 months',
        type: 'education' as const,
        completed: false
      },
      {
        id: 3,
        title: 'Master Design Tools',
        description: 'Become proficient in Figma, Sketch, Adobe XD, and prototyping tools. Learn basic front-end technologies (HTML/CSS).',
        timeframe: '3-6 months',
        type: 'skill' as const,
        completed: false
      },
      {
        id: 4,
        title: 'Build Design Portfolio',
        description: 'Create compelling portfolio showcasing 3-5 UX projects with full design process documentation and case studies.',
        timeframe: '6-12 months',
        type: 'experience' as const,
        completed: false
      },
      {
        id: 5,
        title: 'Complete UX Certification',
        description: 'Earn Google UX Design Certificate, Nielsen Norman Group certification, or degree in HCI/Design.',
        timeframe: '6-24 months',
        type: 'certification' as const,
        completed: false
      },
      {
        id: 6,
        title: 'Gain Professional Experience',
        description: 'Secure internships or freelance projects to build real-world experience and professional network.',
        timeframe: '6-12 months',
        type: 'experience' as const,
        completed: false
      }
    ]
  };

  const careerOptions = Object.keys(roadmapData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/results" className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Career Roadmaps</h1>
                  <p className="text-slate-600">Detailed step-by-step paths to your dream career</p>
                </div>
              </div>
            </div>
          </div>

          {/* Career Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Select a Career Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {careerOptions.map((career) => (
                <button
                  key={career}
                  onClick={() => setSelectedCareer(career)}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    selectedCareer === career
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h3 className="font-medium text-slate-900">{career}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {roadmapData[career as keyof typeof roadmapData].length} steps
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Roadmap Display */}
          <CareerRoadmap 
            careerTitle={selectedCareer}
            steps={roadmapData[selectedCareer as keyof typeof roadmapData]}
          />

          {/* Progress Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {roadmapData[selectedCareer as keyof typeof roadmapData].filter(step => step.completed).length}
                </div>
                <div className="text-sm text-green-700">Completed Steps</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {roadmapData[selectedCareer as keyof typeof roadmapData].filter(step => !step.completed).length}
                </div>
                <div className="text-sm text-blue-700">Remaining Steps</div>
              </div>
              
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <div className="text-2xl font-bold text-violet-600 mb-1">
                  {Math.round((roadmapData[selectedCareer as keyof typeof roadmapData].filter(step => step.completed).length / roadmapData[selectedCareer as keyof typeof roadmapData].length) * 100)}%
                </div>
                <div className="text-sm text-violet-700">Progress</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to="/education-form" className="btn-primary flex-1 text-center">
              Complete Education Profile
            </Link>
            <Link to="/job-application" className="btn-outline flex-1 text-center">
              Build Job Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;