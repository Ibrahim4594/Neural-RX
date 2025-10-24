import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function SearchResultSkeleton() {
  return (
    <Card data-testid="skeleton-search-result">
      <CardHeader className="space-y-2">
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
          <div className="h-6 w-28 bg-muted animate-pulse rounded-full" />
          <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
