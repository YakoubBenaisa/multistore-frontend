import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import  {useCreate}  from '../hooks/useCreateOrUpdate';
import Alert from '../../../shared/ui/alert/Alert';
import { useNavigate } from 'react-router-dom';

const StorePage = () => {

  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const {createStore, loading, error} = useCreate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createStore({ name: storeName, description: storeDescription });
    navigate('/dashboard');
  }
  return (
    <div className="overflow-hidden min-h-screen flex flex-col justify-center relative pt-20 pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-100 dark:from-indigo-900 to-transparent opacity-30 animate-bg pointer-events-none"></div>
     
      <div className="max-w-2xl mx-auto px-4 relative z-10 w-full">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-8 border border-gray-100 dark:border-gray-800">
        {error && (
        <Alert
          variant="error"
          title="Operation Failed"
          message={error.message ? error.message : "Please check your information and try again."}
        />
      )}
          <h2 className="mt-4 text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Create Your Store
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="storeName" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Store Name
              </label>
              <input 
                type="text" 
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                placeholder="Enter your store name"
              />
            </div>
            
            <div>
              <label 
                htmlFor="storeDescription" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Store Description
              </label>
              <textarea 
                id="storeDescription"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                placeholder="Describe your store, its mission, and what makes it unique"
              />
            </div>
            
            <div className="flex justify-center">
              <button 
                type="submit" 
                className="bg-indigo-600 dark:bg-indigo-500 text-white px-10 py-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transform hover:scale-105 transition-all flex items-center"
              >
                {loading ? "Creating you Store..":"Create Store"}
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StorePage;