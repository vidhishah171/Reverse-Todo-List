export function InsightsSkeleton() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-muted" />
                    <div className="h-7 w-32 bg-muted rounded" />
                </div>
                <div className="h-4 w-64 bg-muted rounded mt-2" />
            </div>
            <div className="h-48 bg-muted rounded-xl" />
            <div className="h-56 bg-muted rounded-xl" />
        </div>
    );
}
