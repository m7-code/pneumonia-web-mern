import { Link } from 'react-router-dom';

export default function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-5 py-6 overflow-y-auto">
      {/* Aurora background blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob one" />
        <div className="aurora-blob two" />
        <div className="aurora-blob three" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="glass-card tint-purple rounded-3xl px-4 py-6">
          <h1 className="relative z-[2] font-display text-4xl font-bold text-center text-ink dark:text-white tracking-wide">
            {title}
          </h1>
          {subtitle && (
            <p className="relative z-[2] text-muted text-sm text-center mt-2 mb-8">{subtitle}</p>
          )}
          {!subtitle && <div className="relative z-[2] mb-10" />}

          <div className="relative z-[2]">{children}</div>
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