import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Zap, Brain, Users, Trophy, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);
    
    const featureElements = featuresRef.current?.querySelectorAll('.feature-card');
    featureElements?.forEach(el => observer.observe(el));
    
    const testimonialElements = testimonialsRef.current?.querySelectorAll('.testimonial-card');
    testimonialElements?.forEach(el => observer.observe(el));
    
    return () => {
      featureElements?.forEach(el => observer.unobserve(el));
      testimonialElements?.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="animated-gradient absolute inset-0 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your <span className="text-violet-700">Perfect Career</span> Path
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Take our interactive assessment powered by AI to uncover career opportunities perfectly matched to your skills, interests, and personality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-outline text-lg">
                Already Have an Account?
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-200 rounded-full opacity-30 blur-3xl"></div>
      </section>
      
      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our simple 3-step process helps you discover your ideal career path
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center opacity-0 slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-violet-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Create Your Profile</h3>
              <p className="text-slate-600">
                Sign up and create your profile to start your career discovery journey.
              </p>
            </div>
            
            <div className="card p-8 text-center opacity-0 slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Take the Assessment</h3>
              <p className="text-slate-600">
                Complete our comprehensive career assessment with 10-20 questions.
              </p>
            </div>
            
            <div className="card p-8 text-center opacity-0 slide-up" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-orange-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Get Personalized Results</h3>
              <p className="text-slate-600">
                Receive AI-powered career recommendations tailored to your unique profile.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section ref={featuresRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get the guidance you need to make confident career decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="feature-card opacity-0 card p-8 hover:border-l-4 hover:border-l-violet-500 transition-all">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-violet-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-slate-600">
                    Our platform leverages the latest AI technology from Google's Gemini to analyze your responses and provide personalized career recommendations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0 card p-8 hover:border-l-4 hover:border-l-teal-500 transition-all">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-teal-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Comprehensive Assessment</h3>
                  <p className="text-slate-600">
                    Our scientifically-designed questions cover personality traits, skills, interests, and values to provide a holistic view of your career potential.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0 card p-8 hover:border-l-4 hover:border-l-orange-500 transition-all">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                  <p className="text-slate-600">
                    Unlike generic career tests, our platform adapts to your responses, creating a truly personalized recommendation experience.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="feature-card opacity-0 card p-8 hover:border-l-4 hover:border-l-purple-500 transition-all">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Actionable Guidance</h3>
                  <p className="text-slate-600">
                    Beyond just career suggestions, receive practical steps and resources to help you pursue your ideal career path.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how our platform has helped others find their perfect career
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card opacity-0 card p-8">
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 italic">
                "I was stuck in a career I didn't enjoy. After taking the assessment, I discovered my passion for UX design and made the switch. I'm now happier than ever in my new role!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-violet-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-slate-500">UX Designer</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card opacity-0 card p-8">
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 italic">
                "As a recent graduate, I had no idea what career to pursue. The assessment matched me with data science, which perfectly aligns with my analytical skills and interests."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-slate-500">Data Scientist</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card opacity-0 card p-8">
              <div className="mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 italic">
                "I was considering a career change but wasn't sure which direction to take. The assessment confirmed my interest in teaching and helped me transition into educational technology."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Jessica Rodriguez</h4>
                  <p className="text-sm text-slate-500">EdTech Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-violet-700 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-500 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500 rounded-full opacity-30 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Career?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of others who have discovered their ideal career path using our AI-powered assessment.
            </p>
            <Link to="/signup" className="btn bg-white text-violet-700 hover:bg-slate-100 text-lg font-semibold px-8 py-4">
              Take the Assessment Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;