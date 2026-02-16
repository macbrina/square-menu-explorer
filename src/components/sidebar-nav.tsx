"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Home, Moon, Sun, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { cn } from "@/lib/utils";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function ThemeButton({ label }: { label?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      className={cn(
        "flex items-center gap-3 rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        label ? "h-10 px-3" : "h-10 w-10 justify-center",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
      {label && (
        <span className="text-sm font-medium">{isDark ? "Light mode" : "Dark mode"}</span>
      )}
    </button>
  );
}

// desktop: icon-only column
function DesktopNav() {
  return (
    <div className="flex h-full flex-col items-center py-4">
      <Image
        src="/logo.png"
        alt="Menu Explorer"
        width={44}
        height={44}
        className="rounded-2xl shadow-md"
        priority
      />

      <nav className="mt-8 flex flex-col items-center gap-2" aria-label="Main navigation">
        <button
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
            "bg-primary/10 text-primary",
          )}
          aria-label="Home"
          aria-current="page"
        >
          <Home className="h-5 w-5" />
        </button>
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col items-center gap-2">
        <ThemeButton />
      </div>
    </div>
  );
}

// mobile: icons + labels
function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Menu Explorer"
            width={44}
            height={44}
            className="shrink-0 rounded-2xl shadow-md"
            priority
          />
          <span className="text-base font-semibold">Menu Explorer</span>
        </div>
        <SheetClose className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">Close menu</span>
        </SheetClose>
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Main navigation">
        <button
          onClick={onNavigate}
          className="flex h-10 items-center gap-3 rounded-xl bg-primary/10 px-3 text-primary transition-colors"
          aria-current="page"
        >
          <Home className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">Home</span>
        </button>
      </nav>

      <div className="flex-1" />

      <ThemeButton label />
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-16 md:shrink-0 md:flex-col md:items-center md:border-r md:bg-card">
      <DesktopNav />
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-3 md:hidden">
      <Image
        src="/logo.png"
        alt="Menu Explorer"
        width={36}
        height={36}
        className="rounded-xl"
        priority
      />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <MobileNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
