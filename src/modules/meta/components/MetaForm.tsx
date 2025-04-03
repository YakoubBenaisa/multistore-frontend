import React, { useState, useEffect } from 'react';
import { MetaIntegration } from '../types/types'; // { pageId, appId, secret_token }
import { useCreateMetaIntegration } from '../hooks/create';
import { useUpdateMetaIntegration } from '../hooks/update';
import { useDeleteMetaIntegration } from '../hooks/delete';

export default function MetaIntegrationForm() {
  // Local form state
  const [form, setForm] = useState<MetaIntegration>({ pageId: '', appId: '', access_token: '' });
  // Local integration state to know whether an integration exists
  const [integration, setIntegration] = useState<any>(null);

  // Assume storeId is defined (replace with your actual store id logic)
  const storeId = '123';

  // Hooks for creating, updating, and deleting
  const { createMetaIntegration, metaIntegration: createdIntegration, loading: createLoading, error: createError } =
    useCreateMetaIntegration();
  const { updateMetaIntegration, metaIntegration: updatedIntegration, loading: updateLoading, error: updateError } =
    useUpdateMetaIntegration();
  const { deleteMetaIntegration, loading: deleteLoading, error: deleteError } = useDeleteMetaIntegration(storeId);

  // When a new integration is created, update local integration state.
  useEffect(() => {
    if (createdIntegration) {
      setIntegration(createdIntegration);
    }
  }, [createdIntegration]);

  // When the integration is updated, update local integration state.
  useEffect(() => {
    if (updatedIntegration) {
      setIntegration(updatedIntegration);
    }
  }, [updatedIntegration]);

  // Handler for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map form fields to API payload field names
    const payload = {
      app_id: form.appId,
      page_id: form.pageId,
      access_token: form.access_token,
    };

    try {
      if (integration) {
        // Update if an integration already exists
        await updateMetaIntegration(payload);
        console.log('Meta Integration updated');
      } else {
        // Create if no integration exists
        await createMetaIntegration(payload);
        console.log('Meta Integration created');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for delete
  const handleDelete = async () => {
    try {
      await deleteMetaIntegration();
      setIntegration(null);
      console.log('Meta Integration deleted');
    } catch (err) {
      console.error(err);
    }
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
              type="text"
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
              type="text"
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
              value={form.access_token}
              onChange={(e) => setForm({ ...form, access_token: e.target.value })}
              className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="py-4 sm:py-5 sm:px-6">
          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {integration ? 'Update Meta Integration' : 'Create Meta Integration'}
          </button>
          {integration && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Delete Meta Integration
            </button>
          )}
        </div>
      </form>
      {/* Display errors if any */}
      {createError && <p className="text-red-500">Create Error: {createError}</p>}
      {updateError && <p className="text-red-500">Update Error: {updateError}</p>}
      {deleteError && <p className="text-red-500">Delete Error: {deleteError}</p>}
    </div>
  );
}
