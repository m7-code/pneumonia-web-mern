import { Link } from 'react-router-dom';

export default function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-6 overflow-y-auto">
      <div className="w-full max-w-[400px]">
        <div className="rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.08] px-4 py-6">
          <h1 className="font-display text-4xl font-bold text-center text-ink tracking-wide">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted text-sm text-center mt-2 mb-8">{subtitle}</p>
          )}
          {!subtitle && <div className="mb-10" />}

          {children}
        </div>

        <p className="text-center text-sm text-muted mt-6">
          {footerText}{' '}
          <Link to={footerLinkTo} className="text-primary font-semibold hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}