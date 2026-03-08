import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
      <h1 className="mb-2 text-7xl font-bold text-blue-500">404</h1>
      <h2 className="mb-4 text-xl">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center text-gray-400">
        This admin page doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
