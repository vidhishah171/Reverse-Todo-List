import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="space-y-2 mb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-9 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-9 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-5"><Skeleton className="h-20" /></CardContent></Card>
        <Card><CardContent className="p-5"><Skeleton className="h-20" /></CardContent></Card>
      </div>

      {/* Goals + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent></Card>
        <Card><CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </CardContent></Card>
      </div>

      {/* Weekly bar */}
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-end gap-2 h-14">
            {[32, 24, 40, 28, 36, 20, 44].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <Skeleton className="w-full" style={{ height: `${h}px` }} />
                <Skeleton className="h-2 w-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardContent className="p-5 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>

      {/* Challenges + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent></Card>
        <Card><CardContent className="p-5 space-y-3">
          <Skeleton className="h-4 w-36" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </CardContent></Card>
      </div>

      {/* Today's wins */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <Skeleton className="w-4 h-4 rounded-full mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
