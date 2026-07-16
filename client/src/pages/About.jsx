import Navbar from '../components/Navbar';

// Process steps - real sequence hai (upload -> analyze -> result), isliye numbering justified hai
const STEPS = [
  {
    number: '01',
    title: 'Upload a scan',
    description: 'Submit a chest X-ray image through the results page in a standard format.',
  },
  {
    number: '02',
    title: 'AI analysis',
    description: 'A trained CNN model examines the image for patterns associated with pneumonia.',
  },
  {
    number: '03',
    title: 'Review the result',
    description: 'Get a screening result with a confidence score to discuss with a doctor.',
  },
];

export default function About({ user, onLogout, dark, setDark }) {
  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />

      <main className="mx-auto max-w-4xl px-5 md:px-8 pt-14 pb-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-primary text-white text-xs font-semibold px-4 py-1.5 mb-4">
            About the project
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-white leading-tight">
            AI-assisted screening,<br />built for early awareness
          </h1>
          <p className="text-muted font-medium mt-4 max-w-lg mx-auto leading-relaxed">
            PneumoFusion uses a deep learning model to screen chest X-rays for signs of
            pneumonia, helping people get a faster first read while they seek proper medical care.
          </p>
        </div>

        {/* Mission card */}
        <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-8 mb-16">
          <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-3">
            Why this exists
          </h2>
          <p className="text-muted font-medium leading-relaxed">
            Pneumonia remains a leading cause of preventable illness worldwide, and early
            detection makes a real difference in outcomes. PneumoFusion was built as a
            final year project to explore how accessible AI tools can support — not replace —
            the diagnostic process, giving people a quick first signal so they know when to
            seek professional care sooner.
          </p>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <h2 className="font-display text-xl font-bold text-ink dark:text-white mb-6 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-6"
              >
                <span className="font-mono text-xs text-primary font-bold">{step.number}</span>
                <h3 className="font-display font-bold text-ink dark:text-white mt-2 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-muted font-medium leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech + disclaimer */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-6">
            <h3 className="font-display font-bold text-ink dark:text-white mb-2">
              Built with
            </h3>
            <p className="text-sm text-muted font-medium leading-relaxed">
              A convolutional neural network trained on chest X-ray data, served through a
              FastAPI backend, with a React interface for uploading scans and reviewing results.
            </p>
          </div>

          <div className="rounded-3xl bg-primary/10 dark:bg-primary/10 border border-primary/20 p-6">
            <h3 className="font-display font-bold text-ink dark:text-white mb-2">
              A note on accuracy
            </h3>
            <p className="text-sm text-muted font-medium leading-relaxed">
              PneumoFusion is a screening aid, not a diagnostic tool. Results should always
              be reviewed with a qualified healthcare professional before making any medical decision.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}