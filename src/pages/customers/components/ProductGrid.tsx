import { ProductCard } from "./ProductCard";
import { motion } from "framer-motion";

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const ProductGrid = ({ title, products }: { title: string; products: any[] }) => {
  return (
    <section className="my-12 px-4">
      <h2 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-8">
        {title}
      </h2>
      {products && products.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={gridVariants}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500">No products available.</p>
      )}
    </section>
  );
};
