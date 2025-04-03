import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FilterIcon,
  Plus,
  BarChart2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useGetCustomers } from '../hooks/useGetCustomers';
import { customerService } from '../services/service';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../shared/ui/table";
import Button from "../../../shared/ui/button/Button";

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const CustomersTable = () => {
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || '';
  const { fetchCustomers, loading, error } = useGetCustomers(storeId);
  const [customers, setCustomers] = useState<any[]>([]);
  // Object mapping customer.id to order count.
  const [orderCounts, setOrderCounts] = useState<{ [customerId: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search input.
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch customers only when the storeId changes.
  useEffect(() => {
    const loadCustomers = async () => {
      const data = await fetchCustomers();
      if (data?.length) setCustomers(data);
    };
    loadCustomers();
  }, [storeId]);

  // After customers are loaded, fetch each customer's order count.
  useEffect(() => {
    const fetchOrderCounts = async () => {
      const counts: { [customerId: string]: number } = {};
      await Promise.all(
        customers.map(async (customer) => {
          try {
            const response = await customerService.getCustomer(customer.id);
            console.log(response);
            counts[customer.id] = response.data.data.orders.length;
          } catch (err) {
            counts[customer.id] = 0;
          }
        })
      );
      setOrderCounts(counts);
    };

    if (customers.length > 0) {
      fetchOrderCounts();
    }
  }, [customers]);

  // Memoized filtered customers.
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [customers, debouncedSearchTerm]);

  // Pagination calculations.
  const totalPages = useMemo(() => Math.ceil(filteredCustomers.length / itemsPerPage), [filteredCustomers, itemsPerPage]);
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  // Pagination range calculation.
  const getPaginationRange = useCallback((): (number | string)[] => {
    const totalPageNumbers = 5;
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      return [1, 2, 3, 'DOTS', totalPages];
    }
    if (showLeftDots && !showRightDots) {
      return [1, 'DOTS', totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, 'DOTS', currentPage, 'DOTS', totalPages];
  }, [currentPage, totalPages]);

  const paginate = useCallback((page: number) => setCurrentPage(page), []);
  const goToPreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Action handlers.
  const handleDelete = useCallback(async (customerId: string) => {
    try {
      await customerService.deleteCustomer(customerId);
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      toast.success("Customer deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete customer");
    }
  }, []);

  const handleSendEmail = useCallback((customer: any) => {
    toast.info(`Sending email to ${customer.name}`);
  }, []);

  const handleSendSMS = useCallback((customer: any) => {
    toast.info(`Sending SMS to ${customer.name}`);
  }, []);

  if (loading) return <div className="p-4">Loading customers...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading customers</div>;

  return (
    <div className="relative p-4">
      {/* Header Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 mb-4 shadow">
        <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Customers</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 block w-full sm:w-64 rounded-md border border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FilterIcon size={15} />
              Filter
            </Button>
            <Link to="/customers/create">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Plus size={15} />
                Create Customer
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <BarChart2 size={15} />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-x-auto dark:bg-black bg-white rounded-xl shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined On
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Orders
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell  className="text-center py-4">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                    {customer.name}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                    {customer.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-white">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center text-gray-800 dark:text-white">
                    {orderCounts[customer.id] !== undefined ? orderCounts[customer.id] : 'Loading...'}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleSendEmail(customer)} className="text-green-600 hover:text-green-800">
                        <Mail size={20} />
                      </button>
                      <button onClick={() => handleSendSMS(customer)} className="text-purple-600 hover:text-purple-800">
                        <MessageCircle size={20} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Prev
        </Button>
        
        <div className="flex gap-2">
          {getPaginationRange().map((page, index) =>
            page === 'DOTS' ? (
              <span key={index} className="px-3 py-1">...</span>
            ) : (
              <Button
                key={index}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => paginate(Number(page))}
              >
                {page}
              </Button>
            )
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight size={16} />
        </Button>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default CustomersTable;
