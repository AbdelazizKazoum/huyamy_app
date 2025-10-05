"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto my-12 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="my-4">
        We couldn&apos;t load the product details. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Try again
      </button>
    </div>
  );
}
