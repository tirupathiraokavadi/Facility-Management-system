
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FastFix</h3>
            <p className="text-gray-300 text-sm">
              Connecting customers with skilled professionals for all your facility management needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">Home</a></li>
              <li><a href="/workers" className="text-gray-300 hover:text-white text-sm transition-colors">Find Workers</a></li>
              <li><a href="/worker-registration" className="text-gray-300 hover:text-white text-sm transition-colors">Register as Worker</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 9381680053</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>supportfastfix@gmail.com</span>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>1-1,Ranasthalam,Srikakulam,Andhra Pradesh, India - 532407</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FastFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
