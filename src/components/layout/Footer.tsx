
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-patho-primary text-white flex items-center justify-center text-xl font-bold">
                D
              </div>
              <span className="text-xl font-bold">Dr. Patho</span>
            </div>
            <p className="text-gray-600 mb-4">
              Making diagnostic tests accessible and convenient for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/labs" className="hover:text-patho-primary">Find Labs</Link></li>
              <li><Link to="/tests" className="hover:text-patho-primary">Book Tests</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Home Collection</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Health Packages</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-patho-primary">About Us</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Contact</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Careers</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Partner With Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/" className="hover:text-patho-primary">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-patho-primary">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Dr. Patho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
