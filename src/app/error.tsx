'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Unhandled error caught by error boundary', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    }, 'ErrorBoundary');
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
      <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-center text-gray-400">
        An unexpected error occurred. This has been logged automatically.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
