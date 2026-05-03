import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="ws-badge mb-6">404 Error</div>
      <h1 className="text-6xl font-serif font-bold text-foreground mb-6">Page Not Found</h1>
      <p className="text-xl text-[#6b4c2a] max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for has been moved or no longer exists.
      </p>
      <Link href="/" className="px-8 py-3 bg-primary text-white font-bold rounded shadow hover:opacity-90 transition-opacity">
        Return Home
      </Link>
    </div>
  );
}
