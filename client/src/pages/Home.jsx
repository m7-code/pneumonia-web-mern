import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
// import LungIllustration from '../components/LungIllustration';
import StatCard from '../components/StatCard';
import AssistantCard from '../components/AssistantCard';

export default function Home({ user , onLogout }) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />

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
          <div className="flex flex-col gap-5 order-2 md:order-1">
            <StatCard icon="◎" label="AI Detection Confidence" value="—" unit="replace with real score">
              <div className="mt-3 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-primary to-primary-dark" />
              </div>
              <div className="flex justify-between text-[10px] text-muted mt-1">
                <span>0%</span><span>100%</span>
              </div>
            </StatCard>

            <StatCard icon="▤" label="Weekly Scans Analyzed" value="—" unit="connect to your data">
              <div className="flex items-end gap-1.5 h-16 mt-3">
                {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-primary/70" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted mt-1">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => <span key={d}>{d}</span>)}
              </div>
            </StatCard>

            <Link
              to={user ? '/results' : '/register'}
              className="mt-2 rounded-full bg-primary text-white text-center font-medium px-6 py-3.5 hover:bg-primary-dark transition-colors"
            >
              Analyze a scan →
            </Link>
          </div>

          {/* CENTER: Lung image */}
<div className="relative order-1 md:order-2 flex items-center justify-center min-h-[380px]">
  <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
  <div className="relative w-80 md:w-[26rem]">
  <img
    src="/lung1.png"
    alt="Lung illustration"
    className="w-full h-auto drop-shadow-[0_20px_40px_rgba(232,97,90,0.35)]"
  />
</div>
            {/* Floating connector labels - absolute positioned */}
            <div className="hidden md:block absolute left-2 top-[42%] rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl px-4 py-2.5 shadow-lg text-xs">
              <div className="text-muted">Oxygen Saturation</div>
              <div className="text-ink dark:text-white font-semibold">— %</div>
            </div>
            <div className="hidden md:block absolute right-2 top-[55%] rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl px-4 py-2.5 shadow-lg text-xs">
              <div className="text-muted">Respiratory Rate</div>
              <div className="text-ink dark:text-white font-semibold">— /min</div>
            </div>
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl px-4 py-2.5 shadow-lg text-xs">
              <div className="text-muted">Airway Clarity</div>
              <div className="text-ink dark:text-white font-semibold">Normal</div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-5 order-3">
            <StatCard icon="◈" label="Oxygen Level" value="—" unit="live data pending">
              <svg viewBox="0 0 200 50" className="w-full h-10 mt-2">
                <polyline
                  points="0,30 20,15 35,35 50,10 65,28 80,20 95,32 110,12 125,25 140,18 155,30 170,15 185,25 200,20"
                  fill="none" stroke="#7C6FF0" strokeWidth="2"
                />
              </svg>
            </StatCard>

            <AssistantCard />
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted mt-14">
          PneumoFusion provides AI-assisted screening support and does not replace professional medical diagnosis.
        </p>
      </main>
    </div>
  );
}