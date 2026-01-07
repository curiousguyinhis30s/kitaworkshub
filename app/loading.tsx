export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-white animate-pulse">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="h-10 w-40 rounded-lg bg-primary-100" />
          <div className="hidden lg:flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 rounded bg-gray-200" />
            ))}
          </div>
          <div className="lg:hidden h-6 w-6 rounded bg-gray-200" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Skeleton */}
        <div className="space-y-4 mb-16">
          <div className="h-12 w-3/4 max-w-2xl rounded-lg bg-primary-100" />
          <div className="h-6 w-1/2 max-w-xl rounded bg-gray-200" />
          <div className="flex gap-4 mt-8">
            <div className="h-12 w-32 rounded-lg bg-primary-200" />
            <div className="h-12 w-32 rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-6 space-y-4">
              <div className="h-48 w-full rounded-lg bg-gray-100" />
              <div className="h-6 w-3/4 rounded bg-primary-100" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
              </div>
              <div className="h-10 w-24 rounded-lg bg-primary-100" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
