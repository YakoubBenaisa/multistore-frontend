import { motion } from 'framer-motion';

const backgroundVariants = {
  animate: {
    scale: [1, 1.05, 1],
    rotate: [0, 10, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const Hero = ({ description }: { description: string }) => {
  return (
    <div className="relative h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Animated background shapes */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20"
        variants={backgroundVariants}
        animate="animate"
      >
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Hero content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl px-4 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Curated Excellence, <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Delivered with Care
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl text-gray-300 font-light leading-relaxed"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
