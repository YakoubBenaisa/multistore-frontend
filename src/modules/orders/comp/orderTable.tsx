import { useState, useEffect } from 'react';
import {
  FilterIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash,
  ChevronDown,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Dialog } from '@headlessui/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../shared/ui/table";
import Badge from "../../../shared/ui/badge/Badge";
import Button from '../../../shared/ui/button/Button';
import { useGetStoreOrders } from '../hooks/useGetStoreOrders';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { orderService } from '../services/service';
import { ProductService } from '../../inventory/products/services/service';

type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

interface Address {
  street: string;
  city: string;
  state: string;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: Address;
  order_items: Array<{
    product_id: string;
    quantity: number;
    unit_price: string;
  }>;
  total_amount: string;
  status: OrderStatus;
  created_at: string;
}

const statusOptions: OrderStatus[] = ['pending', 'processing', 'delivered', 'cancelled'];
const statusColors: Record<OrderStatus, 'success' | 'warning' | 'error' | 'gray'> = {
  delivered: 'success',
  processing: 'warning',
  cancelled: 'error',
  pending: 'gray'
};

const OrdersTable = () => {
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || "";
  const { fetchStoreOrders } = useGetStoreOrders(storeId);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStatus, setEditingStatus] = useState<{ id: string | null, status: OrderStatus}>({
    id: null,
    status: 'pending'
  });
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchStoreOrders();
        setOrders(ordersData);
        loadProductNames(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    if (storeId) loadOrders();
  }, [storeId, fetchStoreOrders]);

  const loadProductNames = async (orders: Order[]) => {
    const productIds = Array.from(new Set(
      orders.flatMap(order => 
        order.order_items.map(item => item.product_id)
    )));
    
    const names: Record<string, string> = {};
    await Promise.all(productIds.map(async (id) => {
      try {
        const product = await ProductService.getProduct(id);
        names[id] = product.data?.name || `Product ${id.slice(0, 6)}`;
      } catch (error) {
        names[id] = `Product ${id.slice(0, 6)}`;
        console.error(`Error fetching product ${id}:`, error);
      }
    }));
    setProductNames(names);
  };

  const generatePDF = async (order: Order) => {
    try {
      const input = document.getElementById(`pdf-content-${order.id}`);
      if (!input) return;

      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', [210, 500]);
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`order-ticket-${order.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setEditingStatus({ id: null, status: 'pending' });
    }
  };

  const exportToExcel = () => {
    const worksheetData = orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customer.name,
      'Customer Email': order.customer.email,
      'Customer Phone': order.customer.phone,
      'Products': order.order_items.map(item => 
        `${item.quantity}x ${productNames[item.product_id] || item.product_id}`
      ).join(', '),
      'Total Amount': `$${order.total_amount}`,
      'Order Date': new Date(order.created_at).toLocaleDateString(),
      'Status': order.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_export.xlsx");
  };

  const StatusDropdown = ({ order }: { order: Order }) => (
    <div className="relative">
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => setEditingStatus({ id: order.id, status: order.status })}
      >
        <Badge size="sm" color={statusColors[order.status]}>
          {order.status}
        </Badge>
        <ChevronDown size={14} />
      </div>
      
      {editingStatus.id === order.id && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-2">
          {statusOptions.map(status => (
            <div
              key={status}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => handleStatusUpdate(order.id, status)}
            >
              <Badge size="sm" color={statusColors[status]}>
                {status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    setSelectedOrders(currentItems.map(order => order.id));
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  const getPaginationRange = (): (number | string)[] => {
    const totalPageNumbers = 5;
    if (totalPages <= totalPageNumbers) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) return [1, 2, 3, 'DOTS', totalPages];
    if (showLeftDots && !showRightDots) return [1, 'DOTS', totalPages - 2, totalPages - 1, totalPages];
    return [1, 'DOTS', currentPage, 'DOTS', totalPages];
  };

  return (
    <div className="relative">
      {/* PDF Content Templates */}
      {orders.map(order => (
        <div 
          key={order.id} 
          id={`pdf-content-${order.id}`}
          style={{ position: 'absolute', left: '-9999px' }}
        >
          <div style={{ 
            padding: '20px', 
            fontFamily: 'Arial', 
            maxWidth: '600px',
            backgroundColor: '#fff',
            color: '#000'
          }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
              Order Ticket
            </h1>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#444' }}>Order Details</h2>
              <p><strong>Order ID:</strong> #{order.id.slice(0, 8)}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#444' }}>Customer Information</h2>
              <p><strong>Name:</strong> {order.customer.name}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Phone:</strong> {order.customer.phone}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#444' }}>Delivery Address</h2>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '10px', color: '#444' }}>Products</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Product</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Price</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px' }}>{productNames[item.product_id] || item.product_id}</td>
                      <td style={{ textAlign: 'right', padding: '8px' }}>${item.unit_price}</td>
                      <td style={{ textAlign: 'right', padding: '8px' }}>{item.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '8px' }}>
                        ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '2px solid #000' }}>
              <h2 style={{ fontSize: '20px', textAlign: 'right' }}>
                Total Amount: ${order.total_amount}
              </h2>
            </div>
          </div>
        </div>
      ))}

      {/* View Order Modal */}
      <Dialog
        open={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <Dialog.Title className="text-lg font-semibold dark:text-white">
                Order Details - #{viewingOrder?.id.slice(0, 8)}
              </Dialog.Title>
              <button
                onClick={() => setViewingOrder(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                ✕
              </button>
            </div>

            {viewingOrder && (
              <div className="space-y-4 dark:text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2">Customer Information</h3>
                    <p className="font-medium">{viewingOrder.customer.name}</p>
                    <p className="text-gray-600 dark:text-gray-300">{viewingOrder.customer.email}</p>
                    <p className="text-gray-600 dark:text-gray-300">{viewingOrder.customer.phone}</p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium mb-2">Delivery Address</h3>
                    <p>{viewingOrder.address.street}</p>
                    <p>{viewingOrder.address.city}</p>
                    <p>{viewingOrder.address.state}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Ordered Products</h3>
                  <div className="space-y-2">
                    {viewingOrder.order_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded">
                        <div>
                          <p className="font-medium">
                            {productNames[item.product_id] || item.product_id}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.quantity} × ${item.unit_price}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span>${viewingOrder.total_amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Status:</span>
                    <Badge size="sm" color={statusColors[viewingOrder.status]}>
                      {viewingOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Orders</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 block w-full sm:w-64 rounded-md border border-gray-200 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <FilterIcon size={15} />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={exportToExcel}
            >
              <Download size={15} />
              Export
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === currentItems.length}
                      onChange={selectAllOrders}
                      className="form-checkbox h-4 w-4 text-blue-500"
                    />
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Order ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Customer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Products
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Amount
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Date
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customer.name}</span>
                        <span className="text-gray-500 text-sm">{order.customer.email}</span>
                        <span className="text-gray-500 text-sm">{order.customer.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm">
                              {item.quantity}x {productNames[item.product_id] || item.product_id}
                            </span>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <span className="text-gray-500 text-sm">
                            +{order.order_items.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                      ${order.total_amount}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <StatusDropdown order={order} />
                    </TableCell>
                    <TableCell className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        <button
                          onClick={() => generatePDF(order)}
                          className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
                          title="Download Ticket"
                        >
                          <FileText size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          title="Delete Order"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="px-6 py-4 flex items-center justify-between gap-2">
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
                onClick={() => paginate(page as number)}
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
    </div>
  );
};

export default OrdersTable;