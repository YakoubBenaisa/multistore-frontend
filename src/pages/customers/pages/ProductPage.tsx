import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../../api/api';
import { useGetImage } from '../../../modules/inventory/products/hooks/getImage';
import { Navbar } from '../components/Navbar';
import Button from '../../../shared/ui/button/Button';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getImage } = useGetImage();
  const [images, setImages] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const storeName = useSelector((state: RootState) => state.store.store?.name) || 'Store';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data.data);
        
        // Load all images
        const imageUrls = await Promise.all(
          response.data.data.images.map((img: string) => getImage(img))
        );
        setImages(imageUrls);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getImage]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found
      </div>
    );

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Add to cart functionality: saves product details to localStorage.
  const handleAddToCart = () => {
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product is already in the cart.
    const index = cart.findIndex((item: any) => item.id === product.id);
    if (index !== -1) {
      // If exists, update the quantity.
      cart[index].quantity += quantity;
    } else {
      // Otherwise, add new product details.
      cart.push({
        id: product.id,
        quantity: quantity,
        name: product.name,
        price: product.price,
        image: images[0] || ''
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar storeName={storeName} />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden border border-border"
            >
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.inventory_count > 0 ? (
                  <div className="ml-4 flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="ml-4 text-red-500">Out of Stock</div>
                )}
              </div>

              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>

              {product.inventory_count > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="mr-4">Quantity:</span>
                    <div className="flex items-center border border-border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={increaseQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full md:w-auto"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              )}

              <Button variant="secondary" size="icon" className="mt-4">
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
