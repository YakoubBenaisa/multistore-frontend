import { useState } from 'react';
import { PaymentChargily } from '../types/types';
import usePayment from '../hooks/usePaymentSetup';
import { ToastContainer, toast } from 'react-toastify';
import Input from '../../../shared/form/input/InputField';
import 'react-toastify/dist/ReactToastify.css';

export default function PaymentChargilyForm() {
  const [formData, setFormData] = useState<PaymentChargily>({
    secret_key: '',
  });

  const { execute: setupPayment, loading, error } = usePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.secret_key.trim()) {
      toast.error("Please enter a secret key");
      return;
    }
    
    try {
      const response = await setupPayment(formData.secret_key);
      console.log("Updated Payment Settings:", response);
      toast.success("Payment settings updated successfully!");
    } catch (err: any) {
      console.error("Error updating payment settings:", err);
      toast.error(err.message || "An error occurred while updating payment settings");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Payment Integration (Chargily)
        </h3>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0"
      >
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <label htmlFor="secret-key" className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Secret Key
          </label>
          <div className="mt-1 sm:mt-0 sm:col-span-2">
            <Input
              id="secret-key"
              type="password"
              value={formData.secret_key}
              onChange={(e) =>
                setFormData({ ...formData, secret_key: e.target.value })
              }
              className="block w-full shadow-sm sm:text-sm rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="py-4 sm:py-5 sm:px-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Payment Settings'}
          </button>
        </div>
        {error && (
          <div className="py-2 px-6 text-red-500">{error.message}</div>
        )}
      </form>
      
      {/* Toast container configuration */}
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}