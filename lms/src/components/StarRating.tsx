export default function StarRating({ value = 5, count = 5 }: { value?: number; count?: number }) {
  const v = Math.max(0, Math.min(count, value));
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => {
        const isFull = i < Math.floor(v);
        const isHalf = i < v && i >= Math.floor(v);
        return (
          <span 
            key={i} 
            className={`text-base ${
              isFull 
                ? 'text-yellow-400' 
                : isHalf 
                ? 'text-yellow-300' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            {isFull ? '★' : isHalf ? '⭐' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
