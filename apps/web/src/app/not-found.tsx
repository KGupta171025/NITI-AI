import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-4">
      <div className="glass-card rounded-3xl p-12 max-w-md w-full">
        <div className="text-7xl font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-semibold text-slate-100 mb-3">Page not found</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="btn-glow inline-block bg-brand-500 hover:bg-brand-400 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
