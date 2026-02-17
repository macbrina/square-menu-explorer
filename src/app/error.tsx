"use client";

import { DesktopSidebar, MobileHeader } from "@/components/sidebar-nav";
import { ErrorState } from "@/components/error-state";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <ErrorState message="An unexpected error occurred." onRetry={reset} />
        </main>
      </div>
    </div>
  );
}
