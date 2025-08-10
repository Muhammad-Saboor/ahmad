import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Briefcase } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-violet-700" />
              <span className="ml-2 text-xl font-bold text-slate-900">CareerPath AI</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/survey" className="text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium">
                  Take Survey
                </Link>
                <Link to="/profile" className="text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium">
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-violet-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white pt-2 pb-3 space-y-1 px-4 sm:px-3">
          <Link 
            to="/" 
            className="block text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/survey" 
                className="block text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Take Survey
              </Link>
              <Link 
                to="/profile" 
                className="block text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="block text-slate-700 hover:text-violet-700 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="block bg-violet-700 text-white hover:bg-violet-800 px-3 py-2 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;