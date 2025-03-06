import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleDarkMode } from '../states/darkmode/themeSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Brand */}
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          UnifiedCom
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

         
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Link to='/login' >Sign In</Link>
              
            </button>
          
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 px-4">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                dispatch(toggleDarkMode());
                setIsMobileMenuOpen(false);
              }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 mr-2" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 mr-2" /> Dark Mode
                </>
              )}
            </button>

           
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
