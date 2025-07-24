import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const BecomeSellerSection = () => {
  const handleRegisterClick = () => {
    window.location.href = '/seller/register';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
      }
    },
  };

  return (
    <div className="bg-purple-900 py-8 lg:py-16 px-4 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-center gap-x-24 items-center text-center md:text-left">
          <motion.div
            className="mb-6 md:mb-0"
            variants={itemVariants}
          >
            <h3 className="text-white text-xl lg:text-3xl font-bold mb-2">Become a Seller Today!</h3>
            <p className="text-purple-200 text-lg lg:text-xl max-w-lg mx-auto md:mx-0">
              Join our community of independent authors and publishers. Share your knowledge and earn from your creations!
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            {/* Directly apply gradient classes here */}
            <Button
              onClick={handleRegisterClick}
              className="px-8 py-3 text-lg font-semibold
                         bg-gradient-to-r from-purple-600 to-pink-500
                         hover:from-purple-700 hover:to-pink-600
                         text-white rounded-lg shadow-lg transform transition-all duration-200 ease-in-out
                         hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75"
              // Removed variant="secondary" if it overrides background
              // You might need to adjust your Button component to allow overriding background
            >
              Start Selling Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default BecomeSellerSection;