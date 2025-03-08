import { useState } from 'react';
import { MetaIntegration } from '../types/types';

export default function MetaIntegrationForm() {
  const [form, setForm] = useState<MetaIntegration>({ pageId: '', appId: '', secret_token: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process the form data (e.g. send to an API)
    console.log('Updated Meta Integration:', form);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Meta Integration
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <label htmlFor="pageId" className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Page ID
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <input
              id="pageId"
              type="password"
              value={form.pageId}
              onChange={(e) => setForm({ ...form, pageId: e.target.value })}
              className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <label htmlFor="appId" className="text-sm font-medium text-gray-500 dark:text-gray-300">
            App ID
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <input
              id="appId"
              type="password"
              value={form.appId}
              onChange={(e) => setForm({ ...form, appId: e.target.value })}
              className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <label htmlFor="secretToken" className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Secret Token
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <input
              id="secretToken"
              type="password"
              value={form.secret_token}
              onChange={(e) => setForm({ ...form, secret_token: e.target.value })}
              className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="py-4 sm:py-5 sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Update Meta Integration
          </button>
        </div>
      </form>
    </div>
  );
}
