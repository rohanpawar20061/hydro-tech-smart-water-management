import { ChevronRight, Smartphone } from "lucide-react";

export default function MobileInstallGate() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 py-10 overflow-y-auto"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.18 0.06 220) 0%, oklch(0.12 0.04 230) 100%)",
      }}
    >
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src="/assets/uploads/chatgpt_image_mar_28_2026_07_53_09_pm-019d38d4-c150-7469-ab36-5a279995318e-1.png"
          alt="Hydro-Tech Logo"
          className="w-24 h-24 object-contain rounded-2xl shadow-2xl mb-4"
        />
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Hydro-Tech
        </h1>
        <p className="text-sm text-blue-300 mt-1">Smart Water Management</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{
          background: "oklch(0.22 0.05 225 / 0.9)",
          border: "1px solid oklch(0.35 0.08 220 / 0.5)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: "oklch(0.50 0.18 220)" }}
          >
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Install Hydro-Tech App
          </h2>
        </div>

        <p className="text-sm text-blue-200 mb-6 leading-relaxed">
          For the best experience, please install the app on your device before
          continuing.
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {[
            { num: 1, text: "Tap the 3-dot menu (⋮) in Chrome" },
            { num: 2, text: 'Select "Add to Home Screen"' },
            { num: 3, text: 'Tap "Install" or "Add"' },
            { num: 4, text: "Open the app from your home screen" },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
                style={{ background: "oklch(0.50 0.18 220)" }}
              >
                {step.num}
              </span>
              <p className="text-sm text-blue-100 pt-0.5 leading-snug">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl px-4 py-3 flex items-center gap-2"
          style={{ background: "oklch(0.30 0.07 220 / 0.6)" }}
        >
          <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-300 leading-snug">
            Already installed? Open the app from your home screen icon.
          </p>
        </div>
      </div>

      {/* Decorative water wave */}
      <div className="mt-10 opacity-20">
        <svg
          viewBox="0 0 200 40"
          className="w-48"
          fill="none"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M0 20 Q25 5 50 20 Q75 35 100 20 Q125 5 150 20 Q175 35 200 20"
            stroke="oklch(0.65 0.18 210)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 28 Q25 13 50 28 Q75 43 100 28 Q125 13 150 28 Q175 43 200 28"
            stroke="oklch(0.65 0.18 210)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
