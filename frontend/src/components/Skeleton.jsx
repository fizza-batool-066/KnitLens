function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-blush/70 ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-36" />
      ))}
    </div>
  );
}

export default Skeleton;
