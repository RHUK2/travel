import { Hero } from "@/components/hero";
import { PasscodeGate } from "@/components/passcode-gate";
import { RealtimeProvider } from "@/components/realtime-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TripTabs } from "@/components/trip-tabs";

export default function TripPage() {
  return (
    <PasscodeGate>
      <RealtimeProvider>
        <div className="mx-auto max-w-2xl">
          <Hero />
          <main className="px-4 py-8 pb-20">
            <TripTabs />
          </main>
          <footer className="text-muted-foreground border-t px-4 py-6 text-center text-xs">
            요나고 · 돗토리현 · 대중교통 2박 3일 여름 여행
          </footer>
        </div>
        <ScrollToTop />
      </RealtimeProvider>
    </PasscodeGate>
  );
}
