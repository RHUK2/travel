"use client";

import { Calendar, MapPin, Plane } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ParticipantsStrip } from "./participants-strip";
import { ProfileChip } from "./profile-chip";

export function Hero() {
  return (
    <header className="relative overflow-hidden border-b">
      {/* z-0 — gradient + blobs */}
      <div className="to-background dark:to-background absolute inset-0 z-0 bg-linear-to-b from-sky-200/50 via-sky-100/15 via-90% dark:from-sky-950/50 dark:via-sky-900/15 dark:via-90%" />
      <div className="absolute -top-16 -right-16 z-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-700/20" />
      <div className="absolute bottom-0 -left-12 z-0 h-40 w-40 rounded-full bg-indigo-100/50 blur-2xl dark:bg-indigo-900/20" />

      {/* z-10 — LIGHT MODE: sun + clouds */}
      <div
        className="pointer-events-none absolute inset-0 z-10 dark:hidden"
        aria-hidden="true"
      >
        {/* clouds */}
        <div
          className="absolute top-4 animate-[cloudDrift_28s_linear_infinite]"
          style={{ left: "-140px" }}
        >
          <Cloud scale={0.7} opacity={0.9} />
        </div>
        <div
          className="absolute top-3 animate-[cloudDrift_36s_linear_infinite_6s]"
          style={{ left: "-110px" }}
        >
          <Cloud scale={0.55} opacity={0.7} />
        </div>
        <div
          className="absolute top-1/2 animate-[cloudDrift_40s_linear_infinite_10s]"
          style={{ left: "-120px" }}
        >
          <Cloud scale={0.5} opacity={0.65} />
        </div>
        <div
          className="absolute top-1/3 animate-[cloudDrift_32s_linear_infinite_20s]"
          style={{ left: "-130px" }}
        >
          <Cloud scale={0.6} opacity={0.6} />
        </div>
        <div
          className="absolute bottom-10 animate-[cloudDrift_44s_linear_infinite_14s]"
          style={{ left: "-100px" }}
        >
          <Cloud scale={0.5} opacity={0.55} />
        </div>
        <div
          className="absolute bottom-6 animate-[cloudDrift_33s_linear_infinite_18s]"
          style={{ left: "-120px" }}
        >
          <Cloud scale={0.45} opacity={0.5} />
        </div>
      </div>

      {/* z-10 — DARK MODE: stars */}
      <div
        className="pointer-events-none absolute inset-0 z-10 hidden dark:block"
        aria-hidden="true"
      >
        <Star cx="15%" cy="8px" r={2} delay="0.3s" />
        <Star cx="30%" cy="18px" r={1.5} delay="0.8s" />
        <Star cx="50%" cy="6px" r={2.5} delay="1.2s" />
        <Star cx="65%" cy="20px" r={1.5} delay="0.5s" />
        <Star cx="75%" cy="8px" r={2} delay="1.0s" />
        <Star cx="85%" cy="24px" r={1.5} delay="0.2s" />
        <Star cx="20%" cy="40px" r={1.5} delay="1.5s" />
        <Star cx="45%" cy="36px" r={2} delay="0.7s" />
        <Star cx="70%" cy="48px" r={1.5} delay="1.8s" />
      </div>

      {/* z-20 — text content */}
      <div className="relative z-20 px-6 pt-12 pb-8 text-center">
        <p className="text-muted-foreground mb-4 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[3px] uppercase">
          <MapPin className="h-3 w-3" />
          돗토리현 · 일본
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          요나고 2박 3일 여행
        </h1>
        <p className="text-muted-foreground/70 mt-1.5 text-sm font-medium tracking-[5px] uppercase">
          Yonago · Jun 2026
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <div className="bg-background/70 dark:bg-background/50 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
            <Calendar className="h-3.5 w-3.5 text-sky-500" />
            6.1 – 6.3
          </div>
          <div className="bg-background/70 dark:bg-background/50 flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
            <Plane className="h-3.5 w-3.5 text-sky-500" />
            인천 ↔ 요나고
          </div>
        </div>
      </div>

      <ParticipantsStrip />

      {/* z-20 — profile chip + theme toggle */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <ProfileChip />
        <ThemeToggle />
      </div>
    </header>
  );
}

function Cloud({ scale, opacity }: { scale: number; opacity: number }) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "left center",
      }}
    >
      <div className={`relative h-10 w-32`}>
        {/* base */}
        <div
          className={`absolute inset-x-0 bottom-0 h-5 rounded-full bg-white`}
        />
        {/* left bump */}
        <div
          className={`absolute bottom-3 left-2 h-7 w-10 rounded-full bg-white`}
        />
        {/* center bump — tallest */}
        <div
          className={`absolute bottom-3 left-9 h-10 w-14 rounded-full bg-white`}
        />
        {/* right bump */}
        <div
          className={`absolute bottom-3 left-20 h-6 w-9 rounded-full bg-white`}
        />
      </div>
    </div>
  );
}

function Star({
  cx,
  cy,
  r,
  delay,
}: {
  cx: string;
  cy: string;
  r: number;
  delay: string;
}) {
  return (
    <div
      className="absolute animate-[twinkle_2.5s_ease-in-out_infinite]"
      style={{ left: cx, top: cy, animationDelay: delay }}
    >
      <div
        className="rounded-full bg-white"
        style={{
          width: `${r}px`,
          height: `${r}px`,
          boxShadow: `0 0 ${r * 2}px ${r}px rgba(255,255,255,0.6)`,
        }}
      />
    </div>
  );
}
