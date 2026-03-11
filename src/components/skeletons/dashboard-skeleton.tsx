import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Quick add */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-8 w-14 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Row 1: 3 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2: This Week + Today's Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex items-end gap-2 h-20">
              {[32, 24, 40, 28, 36, 20, 44].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <Skeleton className="w-full rounded-sm" style={{ height: `${h}px` }} />
                  <Skeleton className="h-2 w-6" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Goals + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Challenges + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-7 h-7 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
