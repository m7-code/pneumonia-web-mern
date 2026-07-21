// Reusable pill-shaped input with right-side icon
export default function FormInput({ icon, error, ...props }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <input
          {...props}
          className="w-full pl-5 pr-12 py-4 rounded-full border-2 border-black/[0.12] dark:border-white/15 bg-black/[0.04] dark:bg-white/5 text-ink dark:text-white text-sm placeholder:text-black/40 dark:placeholder:text-white/40 outline-none focus:border-primary focus:bg-primary/5 transition-colors"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/50 pointer-events-none">
          {icon}
        </span>
      </div>
      {error && <p className="text-red-500 text-xs mt-2 ml-5">{error}</p>}
    </div>
  );
}