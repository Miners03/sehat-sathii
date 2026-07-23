export default function Home() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 font-sans">
      <div className="bg-surface rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary mx-auto flex items-center justify-center">
          <span className="text-white text-2xl font-bold">S</span>
        </div>

        <h1 className="text-2xl font-semibold text-text">
          SehatSaathi
        </h1>

        <p className="text-text-muted text-base">
          Design tokens are wired up. This placeholder proves{" "}
          <code className="text-primary font-medium">bg-surface</code>,{" "}
          <code className="text-primary font-medium">text-primary</code>, and{" "}
          <code className="text-primary font-medium">font-sans</code> resolve
          correctly from the <code>@theme</code> block.
        </p>

        <p className="text-text-muted text-sm">
          स्वास्थ्य साथी — यह हिन्दी टेक्स्ट Noto Sans Devanagari में रेंडर हो रहा है।
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-self-care/15 text-self-care">
            Self-care
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-monitor/15 text-monitor">
            Monitor
          </span>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-escalate/15 text-escalate">
            Escalate
          </span>
        </div>
      </div>
    </div>
  );
}
