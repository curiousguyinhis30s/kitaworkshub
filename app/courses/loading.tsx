import { Skeleton } from '@/app/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>

      {/* Filter Area Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 py-4 border-b">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>
      </div>

      {/* Course Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 rounded-lg border p-4">
            {/* Image Placeholder */}
            <Skeleton className="h-40 w-full rounded-md" />

            <div className="space-y-2 pt-2">
              {/* Title */}
              <Skeleton className="h-6 w-3/4" />
              {/* Description */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex items-center justify-between pt-4 mt-auto">
              {/* Price */}
              <Skeleton className="h-5 w-16" />
              {/* Instructor */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
