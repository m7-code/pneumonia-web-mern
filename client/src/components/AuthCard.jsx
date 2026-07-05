import { Link } from 'react-router-dom';

// Login aur Register dono ka shared layout - background, card, logo
export default function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-6 overflow-y-auto">
      <div className="w-full max-w-sm">
        {/* Logo */}
        {/* <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <span className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-base">
            🫁
          </span>
          <span className="font-display font-bold text-ink dark:text-white text-lg">
            PneumoFusion
          </span>
        </Link> */}

        {/* Card */}
        <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_40px_rgba(124,111,240,0.15)] border border-white/60 dark:border-white/10 p-8">
          <h1 className="font-display text-xl font-bold text-ink dark:text-white text-center">
            {title}
          </h1>
          <p className="text-muted text-sm text-center mt-1.5 mb-5">{subtitle}</p>

          {children}
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-muted mt-5">
          {footerText}{' '}
          <Link to={footerLinkTo} className="text-primary font-medium hover:text-primary-dark">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}