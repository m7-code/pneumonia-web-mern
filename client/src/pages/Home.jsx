import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import AssistantCard from '../components/AssistantCard';
import { useState } from 'react';

// Icons - StatCard headers ke liye, overall design ke sath consistent stroke style
const TargetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="12" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="10" y="7" width="4" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="16" y="3" width="4" height="17" rx="1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function Home({ user, onLogout, dark, setDark }) {
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Aurora background blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob one" />
        <div className="aurora-blob two" />
        <div className="aurora-blob three" />
      </div>

      <div className="relative z-10">
        <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />

        <main className="mx-auto max-w-7xl px-5 md:px-8 pt-10 pb-16">
          {/* Greeting */}
          <div className="mb-8">
            <span className="inline-block rounded-full bg-primary text-white text-xs font-semibold px-4 py-1.5 mb-3">
              AI Smarter
            </span>
            <h1 className="font-display text-3xl md:text-[2.75rem] font-bold text-ink dark:text-white leading-tight">
              Lung Health, Read by AI
            </h1>
            <p className="text-muted mt-2 max-w-md">
              Upload a chest X-ray and get an AI-assisted pneumonia screening in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-[280px_1fr_300px] gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-5 order-2 md:order-1 h-full">
              <StatCard
                icon={<TargetIcon />}
                label="AI Detection Confidence"
                value="94.55%"
                unit="replace with real score"
                tint="purple"
              >
                <div className="mt-3 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full w-[94.55%] rounded-full bg-gradient-to-r from-primary to-primary-dark" />
                </div>
                <div className="flex justify-between text-[10px] text-muted mt-1">
                  <span>0%</span><span>100%</span>
                </div>
              </StatCard>

              <StatCard
                icon={<ChartIcon />}
                label="Weekly Scans Analyzed"
                value=""
                unit="connect to your data"
                tint="teal"
              >
                <div className="flex items-end gap-1.5 h-16 mt-3">
                  {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </StatCard>

              <Link
                to={user ? '/results' : '/register'}
                className="glossy-btn mt-2 rounded-full text-white text-center font-semibold text-sm uppercase tracking-wider px-6 py-4 transition-transform hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #7C6FF0 50%, #67E8F9 100%)',
                  boxShadow: '0 8px 28px rgba(124, 111, 240, 0.5), inset 0 1px 1px rgba(255,255,255,0.5)',
                }}
              >
                <span className="relative z-[2]">Analyze a scan →</span>
              </Link>
            </div>

            {/* CENTER: Lung image */}
            <div className="relative order-1 md:order-2 flex items-center justify-center min-h-[380px] mx-auto w-full">
              <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-coral/10 to-transparent rounded-full blur-3xl" />
              <div className="relative w-80 md:w-[26rem]">
                <img
                  src="/lung1.png"
                  alt="Lung illustration"
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(124,111,240,0.35)]"
                />
              </div>

              {/* ✅ Floating labels – ab position container + glass-card alag */}
              <div className="hidden md:block absolute left-2 top-[38%]">
                <div className="glass-card tint-purple rounded-2xl px-4 py-2.5 text-xs w-36">
                  <div className="relative z-[2] text-muted">Oxygen Saturation</div>
                  <div className="relative z-[2] text-ink dark:text-white font-semibold">95%</div>
                </div>
              </div>

              <div className="hidden md:block absolute right-2 top-[55%]">
                <div className="glass-card tint-teal rounded-2xl px-4 py-2.5 text-xs w-36">
                  <div className="relative z-[2] text-muted">Respiratory Rate</div>
                  <div className="relative z-[2] text-ink dark:text-white font-semibold">12-20/min</div>
                </div>
              </div>

              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0">
                <div className="glass-card tint-pink rounded-2xl px-4 py-2.5 text-xs w-36">
                  <div className="relative z-[2] text-muted">Airway Clarity</div>
                  <div className="relative z-[2] text-ink dark:text-white font-semibold">Normal</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="hidden md:flex flex-col gap-5 order-3 h-full">
              <AssistantCard userName={user?.name} />
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[11px] text-muted mt-14">
            PneumoFusion provides AI-assisted screening support and does not replace professional medical diagnosis.
          </p>
        </main>

        {/*  Mobile FAB – sirf image, koi background color nahi */}
        <button
  onClick={() => setMobileChatOpen(true)}
  className="md:hidden fixed bottom-5 right-5 h-26 w-26 flex items-center justify-center z-40"
  aria-label="Open assistant"
>
  <img
    src="/chat_icon2.png"
    alt="Chat"
    className="h-full w-full object-contain"
  />
</button>

        {/* Mobile chat overlay */}
        {mobileChatOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center p-3">
            <div className="w-full max-w-md">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="h-9 w-9 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-ink dark:text-white shadow-lg"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <AssistantCard userName={user?.name} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}