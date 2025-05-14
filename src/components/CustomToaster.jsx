// src/components/CustomToaster.jsx
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CustomToaster = () => (
  <Toaster
    position="bottom-center"
    toastOptions={{
      className: '!bg-gray-800 !text-white',
      duration: 4000,
      success: {
        iconTheme: { primary: '#06b6d4', secondary: '#fff' },
      },
      error: {
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      },
    }}
  >
    {(t) => (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
      >
        {t.message}
      </motion.div>
    )}
  </Toaster>
);

export default CustomToaster