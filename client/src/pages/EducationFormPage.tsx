import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, GraduationCap, CheckCircle } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { submitEducationForm, getEducationForm } from '../services/apiClient';

const EducationFormPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    degree: '',
    major: '',
    university: '',
    graduationYear: '',
    gpa: '',
    additionalInfo: ''
  });

  const [success, setSuccess] = useState(false);

  // Load existing form data
  const { data: existingForm } = useQuery({
    queryKey: ['/api/forms/education'],
    queryFn: getEducationForm,
    enabled: !!user,
    onSuccess: (data) => {
      if (data && data.degree) {
        setFormData({
          degree: data.degree || '',
          major: data.major || '',
          university: data.university || '',
          graduationYear: data.graduationYear || '',
          gpa: data.gpa || '',
          additionalInfo: data.additionalInfo || ''
        });
      }
    }
  });

  const submitMutation = useMutation({
    mutationFn: submitEducationForm,
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error) => {
      console.error('Error submitting education form:', error);
      alert('Failed to submit education form. Please try again.');
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Education Form Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Your educational information has been saved successfully.
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
                  <h1 className="text-2xl font-bold text-slate-900">Education Background</h1>
                  <p className="text-slate-600">Share your educational information</p>
                </div>
              </div>
              <GraduationCap className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-slate-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., Bachelor's, Master's, PhD"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-slate-700 mb-2">
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., Computer Science, Information Technology"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-slate-700 mb-2">
                    University/Institution *
                  </label>
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., Stanford University, MIT"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-slate-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., 2024, Expected 2025"
                  />
                </div>

                <div>
                  <label htmlFor="gpa" className="block text-sm font-medium text-slate-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    id="gpa"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="e.g., 3.8/4.0"
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
                    placeholder="Any additional educational details, certifications, or achievements"
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
                  {submitMutation.isPending ? 'Saving...' : 'Save Education Information'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducationFormPage;