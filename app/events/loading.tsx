import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Heading Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* Filter Area Skeleton */}
      <div className="flex flex-wrap gap-4 border-b pb-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="flex-1" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Grid of Event Card Skeletons */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-4 rounded-lg border p-4">
            <Skeleton className="h-48 w-full rounded-md" />

            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
