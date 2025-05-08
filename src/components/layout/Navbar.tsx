
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-inventory-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white text-xl font-bold">
            Logicall
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-white hover:text-inventory-secondary focus:outline-none"
              onClick={toggleMenu}
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-inventory-secondary transition-colors">
              Home
            </Link>
            <Link to="/client/login" className="text-white hover:text-inventory-secondary transition-colors">
              Client Login
            </Link>
            <Link to="/staff/login" className="text-white hover:text-inventory-secondary transition-colors">
              Staff Login
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-blue-700">
            <Link 
              to="/" 
              className="block py-2 text-white hover:text-inventory-secondary transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/client/login" 
              className="block py-2 text-white hover:text-inventory-secondary transition-colors"
              onClick={toggleMenu}
            >
              Client Login
            </Link>
            <Link 
              to="/staff/login" 
              className="block py-2 text-white hover:text-inventory-secondary transition-colors"
              onClick={toggleMenu}
            >
              Staff Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
