import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function CategoryNavSkeleton() {
  return (
    <div className="flex gap-2.5 pb-1">
      {[76, 84, 92, 72, 80].map((w, i) => (
        <Skeleton key={i} className="h-16 shrink-0 rounded-2xl" style={{ width: w }} />
      ))}
    </div>
  );
}

export function SearchBarSkeleton() {
  return <Skeleton className="mt-5 h-11 w-full rounded-full sm:hidden" />;
}

export function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-60" />
        <Skeleton className="h-4 w-44" />
      </div>
      <div className="flex items-center gap-3">
        {/* map pin icon placeholder */}
        <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
        <Skeleton className="h-10 w-[200px] rounded-full" />
        <Skeleton className="hidden h-10 w-[220px] rounded-full sm:block" />
      </div>
    </div>
  );
}

export function MenuSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-8">
      {[0, 1].map((g) => (
        <div key={g}>
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Array.from({ length: g === 0 ? Math.ceil(count / 2) : Math.floor(count / 2) }).map(
              (_, i) => <CardSkeleton key={i} />,
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
