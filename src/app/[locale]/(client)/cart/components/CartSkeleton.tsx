"use client";

export default function CartSkeleton() {
  return (
    <div className="bg-white">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-10">
          <div className="h-9 w-1/3 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-7 w-1/4 bg-slate-200 rounded-lg mt-2 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md border border-slate-200/80"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-5 w-3/4 bg-slate-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-md animate-pulse"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
              <div className="h-8 w-3/4 bg-slate-200 rounded-md animate-pulse"></div>
              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <div className="h-5 w-1/4 bg-slate-200 rounded-md animate-pulse"></div>
                  <div className="h-5 w-1/3 bg-slate-200 rounded-md animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-5 w-1/3 bg-slate-200 rounded-md animate-pulse"></div>
                  <div className="h-5 w-1/2 bg-slate-200 rounded-md animate-pulse"></div>
                </div>
              </div>
              <div className="border-t border-slate-200 mt-6 pt-6">
                <div className="h-12 w-full bg-slate-300 rounded-md animate-pulse"></div>
                <div className="h-6 w-1/2 mx-auto bg-slate-200 rounded-md animate-pulse mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
