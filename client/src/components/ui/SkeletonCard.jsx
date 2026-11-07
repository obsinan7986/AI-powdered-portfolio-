/** Generic skeleton loading card */
export default function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`card p-6 space-y-3 ${className}`} aria-hidden="true">
      <div className="skeleton h-5 w-3/4 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 rounded`}
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 3, cols = 3, lines = 3 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}
