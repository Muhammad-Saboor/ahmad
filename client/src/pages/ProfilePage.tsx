import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, KeyRound, LogOut, Save, Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };
  
  const handleSaveProfile = () => {
    // In a real app, we would update the user's profile here
    setSuccess('Profile updated successfully!');
    setIsEditing(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };
  
  const handleDeleteAccount = () => {
    // In a real app, we would delete the user's account here
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      signOut();
      setLocation('/');
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-violet-700 text-white p-6 md:p-8">
              <div className="text-center">
                <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-violet-700" />
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.email?.split('@')[0]}</h2>
                <p className="text-violet-200 mb-6">{user?.email}</p>
                
                <div className="space-y-3 text-left">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-2 px-4 rounded bg-violet-600 hover:bg-violet-500 text-left flex items-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                  
                  <button 
                    onClick={handleSignOut}
                    className="w-full py-2 px-4 rounded bg-violet-600 hover:bg-violet-500 text-left flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-500 text-left flex items-center mt-auto"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              
              {error && (
                <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg">
                  {success}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-slate-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-field pl-10"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyRound className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input-field pl-10"
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Assessment History</h3>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Career Assessment</p>
                        <p className="text-sm text-slate-500">Completed on {new Date().toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => setLocation('/results')}
                        className="text-violet-700 hover:text-violet-500 font-medium"
                      >
                        View Results
                      </button>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-outline mr-4"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex items-center"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;