import { DesktopSidebar, MobileHeader } from "@/components/sidebar-nav";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex flex-1 items-center justify-center px-4">
          <EmptyState message="Page not found." />
        </main>
      </div>
    </div>
  );
}
