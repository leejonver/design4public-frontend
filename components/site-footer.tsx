export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} design4public. 문의: d4p@design4public.com</p>
      </div>
    </footer>
  );
}

