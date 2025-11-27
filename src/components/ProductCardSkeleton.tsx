const ProductCardSkeleton = () => {
  return (
    <article
      className="group bg-white rounded-lg shadow-sm border border-neutral-200/60 overflow-hidden flex flex-col h-full animate-pulse"
      role="status"
      aria-label="Loading product..."
    >
      {/* Image Skeleton */}
      <div className="relative overflow-hidden bg-neutral-200 h-56 w-full" />

      {/* Product Information Skeleton */}
      <div className="p-4 text-center flex flex-col flex-grow">
        {/* Product Name Skeleton */}
        <div className="h-14 flex items-center justify-center mb-2">
          <div className="h-5 bg-neutral-200 rounded-md w-3/4 mb-2" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-baseline justify-center gap-2 mb-4 mt-auto pt-2">
          <div className="h-6 bg-neutral-200 rounded-md w-20" />
          <div className="h-4 bg-neutral-200 rounded-md w-16" />
        </div>

        {/* Button Skeleton */}
        <div className="h-11 bg-neutral-200 rounded-lg w-full" />
      </div>
    </article>
  );
};

export default ProductCardSkeleton;
