import { useState, useEffect, useCallback } from "react";
import { useCreateProduct } from "../hooks/useCreateProduct"; // Adjust path as needed
import { useUpdateProduct } from "../hooks/useUpdateProduct"; // New update hook import
import useGetCategories from "../../category/hooks/useGet"; // Adjust path as needed
import ComponentCard from "../../../../shared/containers/ComponentCard";
import Label from "../../../../shared/form/Label";
import Input from "../../../../shared/form/input/InputField";
import Select from "../../../../shared/form/Select";
import TextArea from "../../../../shared/form/input/TextArea";
import Checkbox from "../../../../shared/form/input/Checkbox";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useGetImage } from "../hooks/getImage"; // Hook to fetch image blobs
import { ToastContainer, toast } from "react-toastify";

// Define product parameters type
export interface ProductParams {
  id?: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  inventory_count: number;
  images: string[]; // Or adjust this if you're uploading files via FormData
  is_active: boolean;
}

interface ProductCreationFormProps {
  product?: ProductParams;
}

// Helper component that fetches the image (if needed) using the useGetImage hook
const FetchedImage = ({
  imageName,
  ...props
}: { imageName: string; [key: string]: any }) => {
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

export default function ProductCreationForm({ product }: ProductCreationFormProps) {
  // Product state
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productInventory, setProductInventory] = useState("");
  // productCategory holds the selected category id (a string)
  const [productCategory, setProductCategory] = useState("");
  const storeId = useSelector((state: RootState) => state.user.user?.storeId) || "";
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: false,
    description: false,
    price: false,
    inventory: false,
    category: false,
    store: false,
    images: false,
  });

  const { createProduct, loading, error } = useCreateProduct();
  const { updateProduct, loading: updateLoading, error: updateError } = useUpdateProduct();

  // Determine submission mode based on whether a product was passed
  const isEditing = Boolean(product);

  // Dynamic category options using the custom hook
  const { getCategories } = useGetCategories() || {};
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  // Fetch categories using a memoized callback to avoid unnecessary re-fetching
  const fetchCategories = useCallback(async () => {
    if (getCategories) {
      try {
        const categories = await getCategories();
        console.log("Fetched categories:", categories);
        const options = categories.map((cat: any) => ({
          value: cat.id, // Adjust if needed (e.g. cat.store_id)
          label: cat.name,
        }));
        setCategoryOptions(options);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    }
  }, [getCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Populate form fields if editing an existing product
  useEffect(() => {
    if (product) {
      setProductName(product.name);
      setProductDescription(product.description);
      setProductPrice(product.price.toString());
      setProductInventory(product.inventory_count.toString());
      setProductCategory(product.category_id);
      setImageUrls(product.images);
      setIsActive(product.is_active);
    }
  }, [product]);

  // Dropzone onDrop handler wrapped in useCallback
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
    const newImageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newImageUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    onDrop,
  });

  // Cleanup for image URLs when component unmounts or imageUrls change
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  // Remove a selected image
  const removeImage = useCallback((index: number) => {
    setImages((prevImages) => {
      const updated = [...prevImages];
      updated.splice(index, 1);
      return updated;
    });
    setImageUrls((prevUrls) => {
      const updated = [...prevUrls];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // Validate the form fields
  const validateForm = useCallback(() => {
    const errors = {
      name: productName.trim() === "",
      description: productDescription.trim() === "",
      price: productPrice === "" || isNaN(Number(productPrice)) || Number(productPrice) <= 0,
      inventory:
        productInventory === "" || isNaN(Number(productInventory)) || Number(productInventory) < 0,
      category: productCategory === "",
      store: storeId === "",
      images: images.length === 0 && !isEditing, // Allow empty images when editing if no change is needed
    };
    setFormErrors(errors);
    return !Object.values(errors).some((error) => error === true);
  }, [productName, productDescription, productPrice, productInventory, productCategory, storeId, images, isEditing]);

  // Handle form submission using FormData to upload actual image files
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
      try {
        if (isEditing && product && product.id) {
          // Build a JSON payload for update so that price is a number.
          const payload: ProductParams = {
            store_id: storeId,
            name: productName,
            description: productDescription,
            price: Number(productPrice),
            category_id: productCategory,
            inventory_count: Number(productInventory),
            images: imageUrls, // assuming existing image URLs in edit mode
            is_active: isActive,
            id: product.id,
          };
          const result = await updateProduct(product.id, payload);
          console.log("Product updated:", result);
          toast.success("Product updated successfully!");
        } else {
          // Build FormData payload for create mode (file upload scenario).
          const formData = new FormData();
          formData.append("store_id", storeId);
          formData.append("name", productName);
          formData.append("description", productDescription);
          formData.append("price", String(Number(productPrice)));
          formData.append("category_id", productCategory);
          formData.append("inventory_count", String(Number(productInventory)));
          formData.append("is_active", isActive.toString());
          images.forEach((file) => {
            formData.append("images", file);
          });
          const result = await createProduct(formData as unknown as ProductParams);
          console.log("Product created:", result);
          toast.success("Product created successfully!");
          // Reset form fields only in create mode.
          setProductName("");
          setProductDescription("");
          setProductPrice("");
          setProductInventory("");
          setProductCategory("");
          setImages([]);
          setImageUrls([]);
          setIsActive(true);
        }
      } catch (err) {
        console.error("Error submitting product:", err);
      }
    },
    [
      validateForm,
      images,
      productName,
      productDescription,
      productPrice,
      productCategory,
      productInventory,
      isActive,
      storeId,
      createProduct,
      updateProduct,
      isEditing,
      product,
      imageUrls,
    ]
  );

  // Choose loading and error based on mode
  const submissionLoading = isEditing ? updateLoading : loading;
  const submissionError = isEditing ? updateError : error;

  return (
    <ComponentCard title={isEditing ? "Edit Product" : "Create New Product"}>
      <div className="max-h-[60vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Store Selection */}
          <div className="flex flex-col">
            <Label htmlFor="store">Store</Label>
            <Select
              options={[
                { value: "store1", label: "Main Store" },
                { value: "store2", label: "Secondary Store" },
              ]}
              onChange={() => {}} // Replace with a proper handler if needed
              placeholder="Select a store"
              className={`dark:bg-dark-900 ${formErrors.store ? "border-red-500" : ""}`}
            />
            {formErrors.store && <p className="mt-1 text-sm text-red-500">Please select a store</p>}
          </div>

          {/* Product Name */}
          <div className="flex flex-col">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">Product name is required</p>}
          </div>

          {/* Product Description */}
          <div className="flex flex-col md:col-span-2">
            <Label htmlFor="productDescription">Description</Label>
            <textarea
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              error={formErrors.description}
              hint={formErrors.description ? "Product description is required" : ""}
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <Label htmlFor="productPrice">Price</Label>
            <div className="relative">
              <Input
                type="text"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className={`pl-[62px] ${formErrors.price ? "border-red-500" : ""}`}
                placeholder="0.00"
              />
              <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
                <span className="font-medium">$</span>
              </span>
            </div>
            {formErrors.price && <p className="mt-1 text-sm text-red-500">Enter a valid price</p>}
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <Label htmlFor="productCategory">Category</Label>
            <Select
              options={categoryOptions}
              placeholder="Select a category"
              // Option is now a string so we set the category directly.
              onChange={(option: string) => setProductCategory(option)}
              className={`dark:bg-dark-900 ${formErrors.category ? "border-red-500" : ""}`}
            />
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-500">Please select a category</p>
            )}
          </div>

          {/* Inventory */}
          <div className="flex flex-col">
            <Label htmlFor="productInventory">Inventory Count</Label>
            <Input
              type="text"
              id="productInventory"
              value={productInventory}
              onChange={(e) => setProductInventory(e.target.value)}
              className={formErrors.inventory ? "border-red-500" : ""}
              placeholder="0"
            />
            {formErrors.inventory && (
              <p className="mt-1 text-sm text-red-500">Enter a valid inventory count</p>
            )}
          </div>

          {/* Active Status */}
          <div className="flex items-center md:col-span-2">
            <Checkbox
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
              label="Product is active and available for sale"
            />
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <Label>Product Images</Label>
            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 mb-4">
              <div
                {...getRootProps()}
                className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
                  isDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                } ${formErrors.images ? "border-red-500" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="dz-message flex flex-col items-center !m-0">
                  <div className="mb-[22px] flex justify-center">
                    <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <svg
                        className="fill-current"
                        width="29"
                        height="28"
                        viewBox="0 0 29 28"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                    {isDragActive ? "Drop Files Here" : "Drag & Drop Product Images Here"}
                  </h4>
                  <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                    Drag and drop your PNG, JPG, WebP, SVG images here or browse
                  </span>
                  <span className="font-medium underline text-theme-sm text-brand-500">
                    Browse Files
                  </span>
                </div>
              </div>
            </div>
            {formErrors.images && (
              <p className="mt-1 text-sm text-red-500">At least one product image is required</p>
            )}
          </div>

          {/* Image Preview Section */}
          {imageUrls.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-3 font-semibold text-gray-800 dark:text-white/90">Selected Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden h-32 bg-gray-100 dark:bg-gray-800"
                  >
                    {/* Use FetchedImage to fetch the image blob if needed */}
                    <FetchedImage
                      imageName={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6 18L18 6M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {submissionError && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
              {submissionError}
            </div>
          )}

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={submissionLoading} className="px-6 py-2 bg-brand-500 text-white rounded disabled:opacity-50">
              {submissionLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
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
    </ComponentCard>
  );
}
