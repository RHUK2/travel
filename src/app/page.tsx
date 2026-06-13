import { Hero } from "@/components/hero";
import { PasscodeGate } from "@/components/passcode-gate";
import { RealtimeProvider } from "@/components/realtime-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { TripTabs } from "@/components/trip-tabs";
import { TRIP_FOOTER } from "@/lib/trip-data";

export default function TripPage() {
  return (
    <PasscodeGate>
      <RealtimeProvider>
        <div className="mx-auto min-h-dvh max-w-2xl">
          <Hero />
          <main className="px-4 py-8 pb-20">
            <TripTabs />
          </main>
          <footer className="text-muted-foreground border-t px-4 py-6 text-center text-xs">
            {TRIP_FOOTER}
          </footer>
        </div>
        <ScrollToTop />
      </RealtimeProvider>
    </PasscodeGate>
  );
}
