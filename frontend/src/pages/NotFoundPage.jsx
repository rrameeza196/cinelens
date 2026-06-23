import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-8xl mb-6">🎞️</div>
        <h1 className="text-6xl font-black mb-4 text-gradient">404</h1>
        <h2 className="text-2xl font-bold mb-3">Scene Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          This page seems to have been cut from the final edit.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-black text-sm"
          style={{ background: 'linear-gradient(135deg, #e879f9, #a78bfa)' }}>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
