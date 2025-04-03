import { useState, useEffect } from 'react';
import {
  FilterIcon,
  Plus,
  BarChart2,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
} from 'lucide-react';
import type { Product } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../shared/ui/table";
import Badge from "../../../../shared/ui/badge/Badge";
import Button from '../../../../shared/ui/button/Button';
import { useGetProducts } from '../hooks/useGetProducts';
import ProductCreationForm from './createProd'; // Adjust the path as needed
import type { ProductParams } from './createProd';
import { Link } from 'react-router-dom';
import { useGetImage } from '../hooks/getImage'; // Adjust the path as needed

// Inline component to fetch and display an image given its name
const FetchedImage = ({ imageName, ...props }: { imageName: string; [key: string]: any }) => {
  const { image, getImage, loading, error } = useGetImage();
  useEffect(() => {
    getImage(imageName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageName]);
  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center text-xs">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-red-500">
        Error
      </div>
    );
  return <img src={image || undefined} alt={props.alt} {...props} />;
};

// Helper: Transform a Product into ProductParams (adding is_active)
const transformProductToParams = (prod: Product): ProductParams => ({
  id: prod.id,
  store_id: prod.store_id,
  name: prod.name,
  description: prod.description,
  price: prod.price,
  category_id: prod.category_id ?? '',
  inventory_count: prod.inventory_count,
  images: prod.images,
  is_active: true, // default value since Product doesn't have it
});

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 8;
  const { fetchProducts, loading, error } = useGetProducts();

  // Fetch products on mount
  useEffect(() => {
    const getStoreData = async () => {
      try {
        const data: Product[] = await fetchProducts();
        if (data && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching store:', err);
      }
    };
    getStoreData();
  }, [fetchProducts]);

  // Filter products based on search term
  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, products]);

  // Get inventory status
  const getInventoryStatus = (count: number) => {
    if (count >= 50) return { status: "In Stock", color: "success" };
    if (count > 30) return { status: "Limited", color: "warning" };
    return { status: "Low Stock", color: "error" };
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  // Helper: Create pagination range using "DOTS"
  const getPaginationRange = (): (number | string)[] => {
    const totalPageNumbers = 5; // maximum 5 page buttons
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    const firstPage = 1;
    const lastPage = totalPages;
    let pages: (number | string)[] = [];
    if (!showLeftDots && showRightDots) {
      const leftRange = Array.from({ length: 3 }, (_, index) => index + 1);
      pages = [...leftRange, 'DOTS', lastPage];
    } else if (showLeftDots && !showRightDots) {
      const rightRange = Array.from({ length: 3 }, (_, index) => totalPages - 3 + index + 1);
      pages = [firstPage, 'DOTS', ...rightRange];
    } else if (showLeftDots && showRightDots) {
      pages = [firstPage, 'DOTS', currentPage, 'DOTS', lastPage];
    }
    return pages;
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading products...</div>;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Error: {error.message || "An unexpected error occurred."}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with Search and Action Buttons */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Products</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
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
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
            >
              <Plus size={15} />
              Create Product
            </Button>
            <Link to='/'>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <BarChart2 size={15} />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Product
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Category
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Images
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Inventory
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Price
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.length > 0 ? (
                  currentItems.map((product, index) => {
                    const inventoryStatus = getInventoryStatus(product.inventory_count);
                    const actualIndex = indexOfFirstItem + index;
                    return (
                      <TableRow key={actualIndex}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
                              {product.images.length > 0 && (
                                <FetchedImage
                                  imageName={product.images[0]}
                                  alt={product.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {product.name}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {product.description}
                              </span>
                              <span className="hidden text-gray-400 text-theme-xs dark:text-gray-500">
                                {product.id}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {product.category_id || "NULL"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex -space-x-2">
                            {product.images.map((imgName, imgIndex) => (
                              <div
                                key={imgIndex}
                                className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                              >
                                <FetchedImage
                                  imageName={imgName}
                                  alt={`${product.name} image ${imgIndex + 1}`}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge size="sm" color={inventoryStatus.color as "success" | "warning" | "error"}>
                            {inventoryStatus.status} ({product.inventory_count})
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {product.price} DA
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setShowModal(true);
                              }}
                              className="text-blue-500 "
                              title="Edit"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => {
                                // Replace with delete functionality.
                                console.log("Delete product", product.id);
                              }}
                              className="text-red-500 "
                              title="Delete"
                            >
                              <Trash size={20} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
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
              <span key={index} className="px-3 py-1">
                ...
              </span>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay with blur */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div
            className="
              relative z-10 
              w-full 
              max-w-[1000px] 
              max-h-[80vh]      
              overflow-y-auto   
              mx-auto 
              p-4 
              bg-white 
              rounded-lg 
              dark:bg-gray-800
            "
          >
            <ProductCreationForm
              key={editingProduct ? `edit-${editingProduct.id}` : 'new'}
              product={editingProduct ? transformProductToParams(editingProduct) : undefined}
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
