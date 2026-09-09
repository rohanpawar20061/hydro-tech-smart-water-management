import { Button } from "@/components/ui/button";
import { MoreVertical, Share, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid() {
  return /android/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"native" | "ios" | "android-manual">(
    "native",
  );
  const DISMISSED_KEY = "pwa-prompt-dismissed";

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    let fallbackTimer: ReturnType<typeof setTimeout>;

    const handler = (e: Event) => {
      e.preventDefault();
      clearTimeout(fallbackTimer);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode("native");
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));

    fallbackTimer = setTimeout(() => {
      if (isIOS()) {
        setMode("ios");
        setVisible(true);
      } else if (isAndroid()) {
        setMode("android-manual");
        setVisible(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <dialog
              open
              className="pointer-events-auto w-full max-w-sm relative overflow-hidden rounded-2xl shadow-2xl bg-transparent p-0 border-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {/* Background gradient */}
              <div className="bg-gradient-to-br from-[#063B48] via-[#0a5c6e] to-[#0d7f8a] text-white px-6 py-6">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                {/* Close button */}
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Icon + title */}
                <div className="flex flex-col items-center text-center gap-4 relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-inner">
                    <img
                      src="/assets/uploads/chatgpt_image_mar_28_2026_07_53_09_pm-019d38d4-c150-7469-ab36-5a279995318e-1.png"
                      alt="Hydro-Tech"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold tracking-wide">
                      Install Hydro-Tech
                    </h2>
                    <p className="text-sm text-white/70 mt-1 leading-snug">
                      Smart water monitoring — right on your home screen
                    </p>
                  </div>

                  {mode === "ios" && (
                    <div className="bg-white/10 rounded-xl px-4 py-3 text-sm text-white/80 leading-relaxed">
                      Tap <Share className="inline h-4 w-4 mx-0.5" /> at the
                      bottom of your browser, then select{" "}
                      <strong className="text-white">
                        "Add to Home Screen"
                      </strong>
                      .
                    </div>
                  )}

                  {mode === "android-manual" && (
                    <div className="bg-white/10 rounded-xl px-4 py-3 text-sm text-white/80 leading-relaxed">
                      Tap the <MoreVertical className="inline h-4 w-4 mx-0.5" />{" "}
                      menu in Chrome, then select{" "}
                      <strong className="text-white">
                        "Add to Home Screen"
                      </strong>
                      .
                    </div>
                  )}

                  <div className="w-full mt-1 space-y-2">
                    {mode === "native" && (
                      <Button
                        onClick={handleInstall}
                        className="w-full bg-white text-[#063B48] hover:bg-white/90 active:bg-white/80 font-bold text-sm h-11 rounded-xl shadow-md transition-all"
                      >
                        Add to Home Screen
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleDismiss}
                      className="w-full bg-white/15 hover:bg-white/25 text-white/80 font-medium text-sm h-10 rounded-xl transition-all"
                    >
                      {mode === "native" ? "Not now" : "Got it"}
                    </Button>
                  </div>
                </div>
              </div>
            </dialog>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
