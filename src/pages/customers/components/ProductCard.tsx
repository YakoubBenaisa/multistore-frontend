import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetImage } from "../../../modules/inventory/products/hooks/getImage";
import { Link } from "react-router-dom";

export const ProductCard = ({ product }: { product: any }) => {
  const { getImage } = useGetImage();
  const [isHovered, setIsHovered] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch image when component mounts
  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (product.images?.length > 0) {
          const imgUrl = await getImage(product.images[0]);
          setLocalImage(imgUrl);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    fetchImage();
  }, []);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: isHovered ? -8 : 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        {localImage ? (
          <motion.img
            src={localImage}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Favorite Icon */}
        <motion.button
          onClick={toggleFavorite}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 p-2 bg-white/70 rounded-full shadow-md hover:bg-white transition"
        >
          <HeartIcon className={`w-6 h-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
        </motion.button>

        {/* Quick view button */}
        <Link to={`/products/${product.id}`}>
          <motion.button
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Quick View
          </motion.button>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-semibold text-gray-900"
        >
          {product.name}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-gray-500 mt-1"
        >
          ${product.price}
        </motion.p>
      </div>
    </motion.div>
  );
};
