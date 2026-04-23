export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Tomate Sano. Para fines educativos.
        </p>
      </div>
    </footer>
  )
}
