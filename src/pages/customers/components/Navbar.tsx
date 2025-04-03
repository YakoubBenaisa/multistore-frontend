import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from 'lucide-react';
export const Navbar = ({ storeName }: { storeName: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side: Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              {storeName} Store
            </Link>
          </div>

          {/* Middle: Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="categories" className="text-gray-600 hover:text-gray-900">
              Categories
            </Link>
            <Link to="contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>

          {/* Right Side: Search and Menu Toggle */}
          <div className="flex items-center">
            {/* Search Bar (optional) */}
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Cart Icon (optional) */}
            <Link to="cart" className="ml-4 text-gray-600 hover:text-gray-900">
              <ShoppingCartIcon/>
            </Link>
            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Home
            </Link>
            <Link to="/products" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Products
            </Link>
            <Link to="/categories" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Categories
            </Link>
            <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              Contact
            </Link>
            {/* Optional Search Bar for Mobile */}
            <div className="mt-3 px-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
