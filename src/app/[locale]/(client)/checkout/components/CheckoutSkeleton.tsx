"use client";

export default function CheckoutSkeleton() {
  return (
    <div className="bg-white">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-12 ltr:text-left rtl:text-right">
          <div className="h-10 w-1/3 bg-slate-200 rounded-lg animate-pulse mb-3"></div>
          <div className="h-6 w-1/2 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Left Column: Shipping & NEW Payment */}
          <div className="lg:col-span-7 space-y-8 lg:sticky lg:top-24">
            {/* Card 1: Shipping Information Form */}
            <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
            {/* Payment Form Skeleton */}
            <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-20 w-full bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* Summary Skeleton (Right Column) */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <div className="bg-white p-4 lg:p-8 rounded-2xl shadow-xl border border-slate-200/80">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
                <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="space-y-4 mb-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="h-16 w-16 bg-slate-200 rounded-lg animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <div className="h-5 w-12 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="h-12 w-full bg-slate-200 rounded-lg animate-pulse mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
