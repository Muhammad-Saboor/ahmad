import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, Briefcase, Upload, Building, MapPin, DollarSign } from 'lucide-react';
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
      if (data.fullName) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your job application profile has been saved successfully. We'll help match you with relevant opportunities.
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/results" className="mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Job Application Profile</h1>
                  <p className="text-slate-600">Build your professional profile and set job preferences</p>
                </div>
              </div>
              <Briefcase className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume Details Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Upload className="h-6 w-6 text-violet-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">Resume Details</h2>
              </div>
              
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
                    className="input-field"
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
                    className="input-field"
                    placeholder="e.g., Software Engineer, Cybersecurity Analyst"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="achievements" className="block text-sm font-medium text-slate-700 mb-2">
                    Key Achievements
                  </label>
                  <textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={4}
                    placeholder="Notable accomplishments, awards, recognitions, or quantifiable results"
                  />
                </div>
                
                <div>
                  <label htmlFor="projects" className="block text-sm font-medium text-slate-700 mb-2">
                    Projects & Portfolio
                  </label>
                  <textarea
                    id="projects"
                    name="projects"
                    value={formData.projects}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={4}
                    placeholder="Describe significant projects you've worked on, technologies used, and outcomes"
                  />
                </div>
              </div>
            </div>

            {/* Job Preferences Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Briefcase className="h-6 w-6 text-violet-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">Job Preferences</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="desiredJobTitle" className="block text-sm font-medium text-slate-700 mb-2">
                    Desired Job Title *
                  </label>
                  <input
                    type="text"
                    id="desiredJobTitle"
                    name="desiredJobTitle"
                    value={formData.desiredJobTitle}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Software Engineer, Product Manager, etc."
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredIndustries" className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Industries
                  </label>
                  <input
                    type="text"
                    id="preferredIndustries"
                    name="preferredIndustries"
                    value={formData.preferredIndustries}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Technology, Finance, Healthcare, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="salaryExpectation" className="block text-sm font-medium text-slate-700 mb-2">
                    Salary Expectation
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      id="salaryExpectation"
                      name="salaryExpectation"
                      value={formData.salaryExpectation}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="$80,000 - $120,000"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="workLocation" className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Work Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      id="workLocation"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="San Francisco, New York, Remote, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="workType" className="block text-sm font-medium text-slate-700 mb-2">
                    Work Type Preference
                  </label>
                  <select
                    id="workType"
                    name="workType"
                    value={formData.workType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select work type</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="availability" className="block text-sm font-medium text-slate-700 mb-2">
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select availability</option>
                    <option value="immediate">Immediate</option>
                    <option value="2-weeks">2 weeks notice</option>
                    <option value="1-month">1 month</option>
                    <option value="2-months">2 months</option>
                    <option value="3-months">3+ months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Preferences Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-violet-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">Company Preferences</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="companiesOfInterest" className="block text-sm font-medium text-slate-700 mb-2">
                    Companies of Interest *
                  </label>
                  <textarea
                    id="companiesOfInterest"
                    name="companiesOfInterest"
                    value={formData.companiesOfInterest}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={4}
                    placeholder="List specific companies you'd like to work for (e.g., Google, Microsoft, Tesla, local startups, etc.)"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-medium text-slate-700 mb-2">
                      Preferred Company Size
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select company size</option>
                      <option value="startup">Startup (1-50 employees)</option>
                      <option value="small">Small (51-200 employees)</option>
                      <option value="medium">Medium (201-1000 employees)</option>
                      <option value="large">Large (1001-5000 employees)</option>
                      <option value="enterprise">Enterprise (5000+ employees)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="companyType" className="block text-sm font-medium text-slate-700 mb-2">
                      Company Type/Industry
                    </label>
                    <input
                      type="text"
                      id="companyType"
                      name="companyType"
                      value={formData.companyType}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Tech, Finance, Healthcare, Non-profit, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="relocateWillingness" className="block text-sm font-medium text-slate-700 mb-2">
                    Willingness to Relocate
                  </label>
                  <select
                    id="relocateWillingness"
                    name="relocateWillingness"
                    value={formData.relocateWillingness}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes, willing to relocate</option>
                    <option value="no">No, prefer current location</option>
                    <option value="maybe">Open to the right opportunity</option>
                    <option value="remote-only">Remote work only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="portfolioUrl" className="block text-sm font-medium text-slate-700 mb-2">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      id="portfolioUrl"
                      name="portfolioUrl"
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-slate-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      id="githubUrl"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-slate-700 mb-2">
                    Cover Letter Template
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={6}
                    placeholder="Write a general cover letter that can be customized for specific applications"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Application Profile
                    </>
                  )}
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