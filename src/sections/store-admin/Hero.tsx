import { ChevronRight } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center relative pt-20 pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100 dark:from-indigo-900 to-transparent opacity-30 animate-bg pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold">
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Unified Commerce
            </span>
            <span className="block mt-2 text-gray-900 dark:text-white">Unleashed</span>
          </h1>
        </div>
        
        <p className="mt-8 text-2xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
          Transform your business with our all-in-one platform for e-commerce and social media management.
        </p>

        <div className="mt-10 flex justify-center space-x-4">
          <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transform hover:scale-105 transition-all flex items-center">
            Get Started
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
          <button className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all border border-indigo-200 dark:border-gray-600">
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};