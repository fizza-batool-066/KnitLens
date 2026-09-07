import { motion } from "framer-motion";

function AnimatedCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-pink-100/70 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedCard;
