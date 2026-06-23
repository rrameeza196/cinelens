import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StarRating({ value = 0, onChange, size = 'md', readonly = false }) {
  const [hovered, setHovered] = useState(0);

  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  const active = hovered || value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const filled = starValue <= active;
        const half = !filled && starValue - 0.5 <= active;

        return (
          <motion.button
            key={i}
            type="button"
            whileTap={!readonly ? { scale: 0.8 } : {}}
            disabled={readonly}
            onMouseEnter={() => !readonly && setHovered(starValue)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(starValue)}
            className={`${sizes[size]} transition-all duration-100 ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              {half ? (
                <>
                  <defs>
                    <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="50%" stopColor="#374151" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${i})`}
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </>
              ) : (
                <path
                  fill={filled ? '#f59e0b' : '#374151'}
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  stroke={filled ? '#f59e0b' : '#4b5563'}
                  strokeWidth="0.5"
                />
              )}
            </svg>
          </motion.button>
        );
      })}
      {value > 0 && (
        <span className="text-sm font-bold text-amber-400 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
