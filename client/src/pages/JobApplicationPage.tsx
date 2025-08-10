import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, Briefcase, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitJobApplicationForm, getJobApplicationForm } from '../services/apiClient';

const JobApplicationPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    position: '',
    experience: '',
    skills: '',
    phone: '',
    additionalInfo: ''
  });

  const [success, setSuccess] = useState(false);

  // Load existing form data
  const { data: existingForm } = useQuery({
    queryKey: ['/api/forms/job-application'],
    queryFn: getJobApplicationForm,
    enabled: !!user,
    onSuccess: (data) => {
      if (data && data.fullName) {
        setFormData({
          fullName: data.fullName || '',
          position: data.position || '',
          experience: data.experience || '',
          skills: data.skills || '',
          phone: data.phone || '',
          additionalInfo: data.additionalInfo || ''
        });
      }
    }
  });

  const submitMutation = useMutation({
    mutationFn: submitJobApplicationForm,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error) => {
      console.error('Error submitting job application:', error);
      alert('Failed to submit job application. Please try again.');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your job application profile has been saved successfully.
          </p>
          <Link to="/results" className="btn-primary w-full">
            Back to Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/results" className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Job Application Profile</h1>
                  <p className="text-slate-600">Build your professional profile</p>
                </div>
              </div>
              <Briefcase className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-2">
                    Position Applied For *
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., Software Engineer, Cybersecurity Analyst"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-slate-700 mb-2">
                    Experience Level *
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    rows={4}
                    placeholder="Describe your work experience, years in the field, and key roles"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2">
                    Technical Skills *
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    rows={4}
                    placeholder="List your programming languages, tools, frameworks, and technical expertise"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="additionalInfo"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    rows={4}
                    placeholder="Any additional information, portfolio links, achievements, or special circumstances"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="mr-2 h-5 w-5" />
                  )}
                  {submitMutation.isPending ? 'Saving...' : 'Save Job Application'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;