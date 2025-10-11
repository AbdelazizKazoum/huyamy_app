export default function ProductsLoadingSkeleton() {
  return (
    <div className="bg-neutral-50/70">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile Filter Button Skeleton */}
          <div className="lg:hidden mb-6">
            <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Desktop Sidebar Skeleton */}
          <div className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-neutral-200/80 h-fit sticky top-24">
            <div className="space-y-6">
              {/* Search Skeleton */}
              <div className="py-6 border-b border-neutral-200">
                <div className="h-4 bg-gray-200 rounded w-16 mb-4 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Categories Skeleton */}
              <div className="py-6 border-b border-neutral-200">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4 animate-pulse" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Skeleton */}
              <div className="py-6">
                <div className="h-4 bg-gray-200 rounded w-20 mb-4 animate-pulse" />
                <div className="flex items-center justify-between gap-2">
                  <div className="h-10 bg-gray-200 rounded-md flex-1 animate-pulse" />
                  <span className="text-neutral-400">-</span>
                  <div className="h-10 bg-gray-200 rounded-md flex-1 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <main className="lg:col-span-3">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border border-neutral-200/80">
              <div className="h-4 bg-gray-200 rounded w-32 mb-3 sm:mb-0 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse" />
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex items-center justify-center mt-12 mb-8">
              <div className="flex items-center gap-1">
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Product Card Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200/80 overflow-hidden group">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>

        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
