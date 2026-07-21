import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Result', to: '/results' },
  { label: 'Report', to: '/results/report' },
];

// Icons - overall design ke sath consistent stroke style
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function Navbar({ user, onLogout, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-4 z-50 mx-3 md:mx-6">
      <nav className="glass-card tint-neutral mx-auto max-w-7xl rounded-full px-4 md:px-5 py-2.5 flex items-center justify-between gap-4">

        {/* LEFT: Logo */}
        <Link to="/" className="relative z-[2] flex items-center gap-2.5 shrink-0">
          <span className="h-9 w-9 flex items-center justify-center shrink-0">
            <img src="/lung_icon.png" alt="PneumoFusion" className="w-full h-full object-contain" />
          </span>
          <span className="hidden sm:block font-display font-bold text-ink dark:text-white text-lg">
            PneumoFusion
          </span>
        </Link>

        {/* CENTER: Segmented pill nav - desktop only */}
        <div className="relative z-[2] hidden md:flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 rounded-full p-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'glossy-btn bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                <span className="relative z-[2]">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT: Icons + toggle + profile */}
        <div className="relative z-[2] flex items-center gap-2">
          {/* Dark mode toggle - exact provided design */}
          <button
            className={`toggle-switch ${dark ? 'dark-active' : ''}`}
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
          >
            <div className="toggle-knob" />
          </button>

          {/* Profile / Auth */}
          {user ? (
            <div className="hidden sm:flex items-center gap-1.5 bg-black/[0.04] dark:bg-white/5 rounded-full pl-1 pr-1.5 py-1">
              <span className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm text-ink dark:text-white font-medium px-1 max-w-[100px] truncate">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="h-7 w-7 rounded-full flex items-center justify-center text-muted hover:text-primary hover:bg-white/60 dark:hover:bg-white/10 transition-colors shrink-0"
                aria-label="Logout"
                title="Logout"
              >
                <LogoutIcon />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-sm font-medium text-ink dark:text-white hover:bg-black/[0.04] dark:hover:bg-white/5 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="glossy-btn px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <span className="relative z-[2]">Sign up</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden h-9 w-9 rounded-full bg-black/[0.04] dark:bg-white/5 flex items-center justify-center text-ink dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="glass-card tint-neutral md:hidden mt-2 mx-1 rounded-2xl p-3 flex flex-col gap-1">
          {/* User info row - mobile only */}
          {user && (
            <div className="relative z-[2] flex items-center gap-2.5 px-2 py-2 mb-1 border-b border-black/5 dark:border-white/10">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </span>
              <span className="text-sm text-ink dark:text-white font-medium truncate">
                {user.name}
              </span>
            </div>
          )}

          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`relative z-[2] px-3 py-2 rounded-xl text-sm transition-colors ${
                  active
                    ? 'bg-primary text-white font-medium'
                    : 'text-ink dark:text-white hover:bg-primary/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="relative z-[2] h-px bg-black/5 dark:bg-white/10 my-1" />

          {user ? (
            <button
              onClick={() => { onLogout(); setMenuOpen(false); }}
              className="relative z-[2] flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm text-ink dark:text-white hover:bg-primary/10"
            >
              <LogoutIcon />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="relative z-[2] px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="relative z-[2] px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10">
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}