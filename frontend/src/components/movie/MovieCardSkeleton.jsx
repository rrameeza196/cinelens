export default function MovieCardSkeleton({ size = 'md' }) {
  const sizeClasses = {
    sm: 'min-w-[140px] w-[140px]',
    md: 'min-w-[180px] w-[180px]',
    lg: 'min-w-[220px] w-[220px]',
    xl: 'min-w-[280px] w-[280px]',
  };

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="skeleton aspect-[2/3]" />
        <div className="p-3 space-y-2">
          <div className="skeleton h-4 rounded w-4/5" />
          <div className="skeleton h-3 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
