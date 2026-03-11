"use client";

export default function InsightsError() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
                <p className="text-sm text-muted-foreground">Could not load your insights. Please try again.</p>
            </div>
        </div>
    );
}
