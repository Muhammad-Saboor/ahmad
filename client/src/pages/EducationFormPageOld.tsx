import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, GraduationCap, User, Phone, CreditCard, MapPin, Calendar } from 'lucide-react';
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
      if (data.degree) {
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
            <GraduationCap className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Updated!</h2>
          <p className="text-slate-600 mb-6">
            Your educational and personal information has been saved successfully.
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
                  <h1 className="text-2xl font-bold text-slate-900">Educational Profile</h1>
                  <p className="text-slate-600">Complete your educational and personal information</p>
                </div>
              </div>
              <GraduationCap className="h-8 w-8 text-violet-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <GraduationCap className="h-6 w-6 text-violet-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">Education Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="input-field"
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
                    className="input-field"
                    placeholder="e.g., Computer Science, Information Technology"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="idCardNumber" className="block text-sm font-medium text-slate-700 mb-2">
                    ID Card Number *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      id="idCardNumber"
                      name="idCardNumber"
                      value={formData.idCardNumber}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Enter ID card number"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      placeholder="Street address"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="ZIP Code"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Educational Information Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <GraduationCap className="h-6 w-6 text-violet-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">Educational Background</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="highSchool" className="block text-sm font-medium text-slate-700 mb-2">
                    High School
                  </label>
                  <input
                    type="text"
                    id="highSchool"
                    name="highSchool"
                    value={formData.highSchool}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="High school name"
                  />
                </div>
                
                <div>
                  <label htmlFor="highSchoolGradYear" className="block text-sm font-medium text-slate-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    id="highSchoolGradYear"
                    name="highSchoolGradYear"
                    value={formData.highSchoolGradYear}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="2020"
                    min="1950"
                    max="2030"
                  />
                </div>
                
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-slate-700 mb-2">
                    College/University
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="University name"
                  />
                </div>
                
                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-slate-700 mb-2">
                    Degree Type
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Bachelor's, Master's, PhD, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="major" className="block text-sm font-medium text-slate-700 mb-2">
                    Major/Field of Study
                  </label>
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Computer Science, Business, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="collegeGradYear" className="block text-sm font-medium text-slate-700 mb-2">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    id="collegeGradYear"
                    name="collegeGradYear"
                    value={formData.collegeGradYear}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="2024"
                    min="1950"
                    max="2030"
                  />
                </div>
                
                <div>
                  <label htmlFor="gpa" className="block text-sm font-medium text-slate-700 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="3.5"
                    min="0"
                    max="4"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="certifications" className="block text-sm font-medium text-slate-700 mb-2">
                    Certifications
                  </label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="List any professional certifications you have"
                  />
                </div>
                
                <div>
                  <label htmlFor="onlineCourses" className="block text-sm font-medium text-slate-700 mb-2">
                    Online Courses
                  </label>
                  <textarea
                    id="onlineCourses"
                    name="onlineCourses"
                    value={formData.onlineCourses}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Relevant online courses or MOOCs completed"
                  />
                </div>
                
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-2">
                    Technical Skills
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={3}
                    placeholder="Programming languages, software, tools, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-slate-700 mb-2">
                    Languages
                  </label>
                  <textarea
                    id="languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    className="input-field"
                    rows={2}
                    placeholder="Languages you speak and proficiency level"
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Profile
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

export default EducationFormPage;