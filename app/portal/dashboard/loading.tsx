import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-8">
      {/* Welcome Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* 2 Content Sections Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Enrolled Courses Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-1/3" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-7 w-1/3" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
                <div className="flex flex-col items-center justify-center space-y-1">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
