import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Result', to: '/results' },
];

export default function Navbar({ user, onLogout }) {
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setDark(saved === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="sticky top-4 z-50 mx-3 md:mx-6">
      <nav className="mx-auto max-w-7xl rounded-full bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.14)] border border-white/60 dark:border-white/10 px-4 md:px-5 py-2.5 flex items-center justify-between gap-4">

      {/* LEFT: Logo */}
<Link to="/" className="flex items-center gap-2.5 shrink-0">
  <span className="h-9 w-9 flex items-center justify-center shrink-0">
    <img src="/lung_icon.png" alt="PneumoFusion" className="w-full h-full object-contain" />
  </span>
  <span className="hidden sm:block font-display font-bold text-ink dark:text-white text-lg">
    PneumoFusion
  </span>
</Link>

        {/* CENTER: Segmented pill nav - desktop only */}
        <div className="hidden md:flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 rounded-full p-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: Icons + toggle + profile */}
        <div className="flex items-center gap-2">
          {/* Icon buttons - decorative, reference jaisi */}
         

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
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/5 hover:bg-primary/10 transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-semibold">
                  {user.name?.[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:block text-sm text-ink dark:text-white font-medium">
                  {user.name}
                </span>
                <span className="text-muted text-xs">⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-[#1D1A33] shadow-lg border border-black/5 dark:border-white/10 p-1.5">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
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
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden h-9 w-9 rounded-full bg-black/[0.04] dark:bg-white/5 flex items-center justify-center text-ink dark:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ⋮
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-1 rounded-2xl bg-white/95 dark:bg-white/[0.06] backdrop-blur-xl shadow-lg border border-white/60 dark:border-white/10 p-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10">
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-black/5 dark:bg-white/10 my-1" />
          {user ? (
            <button onClick={onLogout} className="px-3 py-2 rounded-xl text-left text-sm text-ink dark:text-white hover:bg-primary/10">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-xl text-sm text-ink dark:text-white hover:bg-primary/10">Sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}