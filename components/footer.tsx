import Link from "next/link"
import { BookOpen } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 md:flex-row md:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-serif text-lg font-bold text-foreground">
            PlannerCraft
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Shop
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Login
          </Link>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Admin
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          {"2026 PlannerCraft. All rights reserved."}
        </p>
      </div>
    </footer>
  )
}
