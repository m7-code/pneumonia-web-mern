import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Back arrow icon - overall design ke sath consistent stroke style
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FullReport({ user, onLogout ,dark , setDark }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, preview } = location.state || {};

  // Agar direct navbar se aaye bina result data ke, to guide karo pehle scan analyze karne ke liye
if (!result) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />
      <main className="mx-auto max-w-md px-5 pt-24 pb-20 text-center">
        <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-10">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl mx-auto mb-4">
            !
          </div>
          <h1 className="font-display text-xl font-bold text-ink dark:text-white mb-2">
            No report to show yet
          </h1>
          <p className="text-sm text-muted font-medium mb-6">
            First go to the Result page and analyze a chest X-ray to generate a report.
          </p>
         <Link
  to="/results"
  className="inline-flex items-center gap-2 rounded-full text-white font-semibold text-sm uppercase tracking-wider px-6 py-3 transition-transform hover:-translate-y-0.5"
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
  }}
>
  Go to Result Page
</Link>
        </div>
      </main>
    </div>
  );
}

  const isPneumonia = result.prediction === 'PNEUMONIA';
  const confidence = Math.round(result.confidence);
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />

      <main className="mx-auto max-w-4xl px-5 md:px-8 pt-10 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink dark:text-white">
              Screening Report
            </h1>
            <p className="text-muted text-sm mt-1">Generated on {today}</p>
          </div>
          <button
  onClick={() => navigate('/results')}
  className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
>
  <BackIcon />
  Back to Analyzer
</button>
        </div>

        {/* Summary banner */}
        <div
          className={`rounded-3xl p-6 mb-6 flex items-center justify-between ${
            isPneumonia
              ? 'bg-coral-dark/10 border border-coral-dark/20'
              : 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'
          }`}
        >
          <div>
            <p className="text-xs text-muted font-medium mb-1">Diagnosis Result</p>
            <p className={`text-3xl font-bold ${isPneumonia ? 'text-coral-dark' : 'text-emerald-600'}`}>
              {result.prediction}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted font-medium mb-1">Model Confidence</p>
            <p className="text-3xl font-bold text-ink dark:text-white">{confidence}%</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Original scan */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-5">
            <h3 className="font-display font-bold text-sm text-ink dark:text-white mb-3">
              Original X-Ray
            </h3>
            {preview && <img src={preview} alt="Original X-ray" className="w-full rounded-xl" />}
          </div>

          {/* Probability breakdown */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-5">
            <h3 className="font-display font-bold text-sm text-ink dark:text-white mb-4">
              Probability Breakdown
            </h3>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted font-medium">Normal</span>
                  <span className="font-semibold text-ink dark:text-white">{result.normal_prob}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${result.normal_prob}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted font-medium">Pneumonia</span>
                  <span className="font-semibold text-ink dark:text-white">{result.pneumonia_prob}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-coral-dark" style={{ width: `${result.pneumonia_prob}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 text-xs text-muted font-medium leading-relaxed">
              The model analyzes visual patterns in the chest X-ray consistent with pneumonia,
              such as opacity and consolidation in lung tissue.
            </div>
          </div>
        </div>

        {/* Grad-CAM full section */}
        {isPneumonia && (
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-6 mb-6">
            <h3 className="font-display font-bold text-ink dark:text-white mb-1">
              AI Focus Regions (Grad-CAM)
            </h3>
            <p className="text-sm text-muted font-medium mb-5">
              Circled areas show where the model detected patterns most associated with pneumonia.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Circled Regions</p>
                <img
                  src={`data:image/png;base64,${result.circled_image_base64}`}
                  alt="Circled regions"
                  className="w-full rounded-xl"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Heatmap Overlay</p>
                <img
                  src={`data:image/png;base64,${result.heatmap_image_base64}`}
                  alt="Heatmap overlay"
                  className="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-3xl bg-primary/10 border border-primary/20 p-6">
          <h3 className="font-display font-bold text-ink dark:text-white mb-2">
            Important Note
          </h3>
          <p className="text-sm text-muted font-medium leading-relaxed">
            This report is generated by an AI screening tool and is intended to support — not
            replace — professional medical judgment. Please consult a qualified healthcare
            provider to confirm this result and discuss appropriate next steps.
          </p>
        </div>
      </main>
    </div>
  );
}