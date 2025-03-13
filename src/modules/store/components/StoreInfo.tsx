import { useState, useEffect } from 'react';
import {useGetStore} from '../hooks/useGetStore';
import { useUpdateStore } from '../hooks/useCreateOrUpdate';
import { Store } from '../types/types';
import Button from '../../../shared/ui/button/Button';

// Import your Redux action
export default function StoreInfoForm() {
  const { fetchStore, loading, error } = useGetStore();
  const { updateStore, loading: updateLoading, error: updateError } = useUpdateStore();
    
  const [store, setStore] = useState<Store | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Fetch the store on component mount only
  useEffect(() => {
    let isMounted = true;
    
    const getStoreData = async () => {
      try {
        const data = await fetchStore();
        
        // Only update state if component is still mounted
        if (isMounted) {
          setStore(data);
          setFormData({
            name: data.name,
            description: data.description,
          });
          
        }
      } catch (err) {
        console.error('Error fetching store:', err);
      }
    };
    
    getStoreData();
    
    // Cleanup function to prevent memory leaks and state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); // Remove fetchStore and dispatch from dependencies to avoid re-fetching

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;
    
    try {
      const { name, description } = formData;
      const response = await updateStore({ name, description });
      if (response.success) {
        const updatedStore = { ...store, ...formData };
        setStore(updatedStore);
        
        // For Redux - safe to dispatch here as it's a user action
        // dispatch(setStoreData(updatedStore));
        
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating store:', err);
    }
  };

  // Handle cancel editing
  const handleToggleEdit = () => {
    if (isEditing && store) {
      // Reset form data to current store data when canceling
      setFormData({
        name: store.name,
        description: store.description,
      });
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!store) return <div className="p-4">No store data available.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Store Information
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={handleToggleEdit}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
        <form
          onSubmit={handleSubmit}
          className="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-700"
        >
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <label htmlFor="store-name" className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Store Name
            </label>
            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  id="store-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                store.name
              )}
            </div>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <label htmlFor="store-description" className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Description
            </label>
            <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <textarea
                  id="store-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              ) : (
                store.description
              )}
            </div>
          </div>
          {isEditing && (
            <div className="py-4 sm:py-5 sm:px-6">
              <Button
                variant="primary"
                size="sm"
                disabled={updateLoading}
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
          {updateError && (
            <div className="p-4 text-red-500">
              Update Error: {updateError.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}