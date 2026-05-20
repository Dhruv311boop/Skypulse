export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6" data-testid="loading-skeleton">
      {/* Current Weather skeleton */}
      <div className="md:col-span-2 md:row-span-2">
        <SkeletonCard className="h-80" />
      </div>
      {/* Weekly forecast skeleton */}
      <div className="md:row-span-2">
        <SkeletonCard className="h-80" />
      </div>
      {/* AQI */}
      <SkeletonCard className="h-36" />
      {/* Sunrise */}
      <SkeletonCard className="h-36" />
      {/* Hourly */}
      <div className="md:col-span-3 lg:col-span-4">
        <SkeletonCard className="h-32" />
      </div>
      {/* Metric tiles */}
      <SkeletonCard className="h-28" />
      <SkeletonCard className="h-28" />
      <SkeletonCard className="h-28" />
      <SkeletonCard className="h-28" />
    </div>
  );
}

function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card skeleton-shimmer rounded-3xl ${className}`} />
  );
}
