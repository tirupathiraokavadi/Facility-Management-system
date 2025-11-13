import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Users, PhoneCall, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pt-20 md:pb-56 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Find Skilled Professionals <br className="hidden md:block" /> For Your Home & Office
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl md:mx-0 mx-auto">
              Connect with verified workers for plumbing, electrical, carpentry, 
              cleaning and more - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to={user ? "/workers" : "/login"}
                 className="px-6 py-3 rounded-md bg-white text-blue-600 font-medium hover:bg-gray-100 transition-colors">
                  Find Workers
                  </Link>
              {!user && (
                <Link to="/worker-registration" className="px-6 py-3 rounded-md bg-blue-800 text-white font-medium hover:bg-blue-900 transition-colors">
                  Register as Worker
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="fill-white">
            <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How FastFix Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you with skilled professionals to solve all your facility management needs efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={<Users className="h-6 w-6" />} title="Find Workers" desc="Browse our listing of qualified professionals filtered by skill category." />
            <FeatureCard icon={<ShieldCheck className="h-6 w-6" />} title="Verified Professionals" desc="All workers are vetted and their skills verified before joining our platform." />
            <FeatureCard icon={<PhoneCall className="h-6 w-6" />} title="Direct Communication" desc="Contact workers directly through our platform for quick response." />
            <FeatureCard icon={<Wrench className="h-6 w-6" />} title="Quality Work" desc="Get your facility management issues resolved by skilled professionals." />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-white">
                  Ready to get started?
                </h2>
                <p className="mt-4 text-lg text-blue-100 max-w-3xl">
                  Join thousands of customers and workers already using FastFix to solve their facility management needs.
                </p>
              </div>
              {!user && (
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                    >
                      Sign up as Customer
                    </Link>
                  </div>
                  <div className="ml-3 inline-flex rounded-md shadow">
                    <Link
                      to="/worker-registration"
                      className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
                    >
                      Register as Worker
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow text-center">
    <div className="mx-auto w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
