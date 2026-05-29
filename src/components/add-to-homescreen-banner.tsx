"use client";

import { PWA_BANNER_KEY } from "@/lib/constants";
import { Download, Share, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AddToHomeScreenBanner() {
  const [mode, setMode] = useState<"ios" | "android" | null>(null);
  const deferredPrompt = useRef<(Event & { prompt: () => Promise<void> }) | null>(null);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const dismissed = localStorage.getItem(PWA_BANNER_KEY) === "1";

    if (isStandalone || dismissed) return;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("ios");
      return;
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      deferredPrompt.current = e as typeof deferredPrompt.current;
      setMode("android");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function handleDismiss() {
    localStorage.setItem(PWA_BANNER_KEY, "1");
    setMode(null);
  }

  async function handleAndroidInstall() {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    setMode(null);
  }

  if (!mode) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border bg-card p-4 shadow-lg">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 text-muted-foreground"
        aria-label="닫기"
      >
        <X size={16} />
      </button>
      <p className="pr-4 text-sm font-medium">홈 화면에 추가하기</p>
      {mode === "ios" ? (
        <p className="mt-1 text-xs text-muted-foreground">
          하단 <Share size={12} className="inline -mt-0.5" /> 공유 버튼 →{" "}
          <strong>홈 화면에 추가</strong>를 탭하면 앱처럼 사용할 수 있어요.
        </p>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={handleAndroidInstall}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            <Download size={12} />
            설치하기
          </button>
          <p className="text-xs text-muted-foreground">앱처럼 사용할 수 있어요.</p>
        </div>
      )}
    </div>
  );
}
