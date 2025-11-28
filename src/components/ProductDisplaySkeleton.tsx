const ProductDisplaySkeleton = () => {
  return (
    <div
      className="bg-white animate-pulse"
      role="status"
      aria-label="Loading product..."
    >
      <main className="py-12">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery Skeleton */}
            <div className="relative">
              <div className="lg:sticky lg:top-24">
                {/* Main Image */}
                <div className="bg-neutral-200 rounded-lg w-full h-96 mb-4" />
                {/* Thumbnail Images */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-neutral-200 rounded-md w-20 h-20"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="space-y-6">
              {/* New Badge */}
              <div className="bg-neutral-200 h-6 w-16 rounded" />

              {/* Title */}
              <div className="bg-neutral-200 h-10 w-3/4 rounded-md" />

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="bg-neutral-200 h-10 w-32 rounded-md" />
                <div className="bg-neutral-200 h-6 w-24 rounded-md" />
                <div className="bg-neutral-200 h-6 w-16 rounded-full" />
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-neutral-200 h-5 w-5 rounded" />
                ))}
              </div>

              {/* Countdown Timer */}
              <div className="bg-neutral-200 h-20 w-full rounded-lg" />

              {/* Description */}
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-neutral-200 h-6 w-40 rounded-md mb-3" />
                <div className="space-y-2">
                  <div className="bg-neutral-200 h-4 w-full rounded" />
                  <div className="bg-neutral-200 h-4 w-full rounded" />
                  <div className="bg-neutral-200 h-4 w-3/4 rounded" />
                </div>
              </div>

              {/* Variant Selector */}
              <div className="pt-4">
                <div className="bg-neutral-200 h-6 w-32 rounded-md mb-3" />
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-neutral-200 h-10 w-20 rounded-lg"
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4 pt-4">
                <div className="bg-neutral-200 h-12 w-full rounded-lg" />
                <div className="bg-neutral-200 h-12 w-full rounded-lg" />
              </div>

              {/* Certification */}
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-neutral-200 h-16 w-16 rounded-md"
                  />
                ))}
              </div>

              {/* Features */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="bg-neutral-200 h-6 w-48 rounded-md mb-6 mx-auto" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg bg-gray-50">
                      <div className="bg-neutral-200 h-10 w-10 rounded-full mx-auto mb-3" />
                      <div className="bg-neutral-200 h-5 w-32 rounded-md mx-auto mb-2" />
                      <div className="bg-neutral-200 h-4 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDisplaySkeleton;
