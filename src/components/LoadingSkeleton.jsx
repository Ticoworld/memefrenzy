const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-700 rounded"></div>
    <div className="h-12 bg-gray-700 rounded"></div>
    <div className="h-12 bg-gray-700 rounded"></div>
    <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
  </div>
);

export default LoadingSkeleton;