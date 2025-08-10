import { Link } from 'wouter';
import { Briefcase, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-violet-400" />
              <span className="ml-2 text-xl font-bold">CareerPath AI</span>
            </div>
            <p className="text-slate-400">
              Discover your perfect career path through our personalized AI-powered assessment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/survey" className="text-slate-400 hover:text-white">
                  Career Assessment
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-400 hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Career Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-700 text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} CareerPath AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;