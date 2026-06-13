"use client";

import { CropDialog } from "@/components/crop-dialog";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CloudShape } from "@/components/cloud-shape";
import {
  deleteSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/lib/session-cookie";
import {
  updateParticipantProfile,
  uploadAvatar,
} from "@/lib/participants-queries";
import { supabase } from "@/lib/supabase";
import { TRIP_LOCATION, TRIP_NAME, TRIP_SUBTITLE } from "@/lib/trip-data";
import type { Session } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Download, Lock, MapPin, MessageSquare, Share, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CLOUDS = [
  { id: 0, top: "7%", dur: 58, del: -12, scale: 0.65, opacity: 0.8 },
  { id: 1, top: "24%", dur: 78, del: -39, scale: 0.5, opacity: 0.65 },
  { id: 2, top: "53%", dur: 66, del: -20, scale: 0.55, opacity: 0.6 },
  { id: 3, top: "73%", dur: 88, del: -62, scale: 0.45, opacity: 0.55 },
  { id: 4, top: "15%", dur: 70, del: -55, scale: 0.4, opacity: 0.5 },
  { id: 5, top: "40%", dur: 50, del: -8, scale: 0.6, opacity: 0.6 },
  { id: 6, top: "62%", dur: 62, del: -47, scale: 0.35, opacity: 0.45 },
  { id: 7, top: "85%", dur: 75, del: -25, scale: 0.5, opacity: 0.5 },
];

const STARS = [
  { id: 0, top: "4%", left: "7%", size: 2.5, dur: 2.5, del: 0.0 },
  { id: 1, top: "11%", left: "22%", size: 1.5, dur: 3.2, del: 0.8 },
  { id: 2, top: "18%", left: "54%", size: 3.0, dur: 2.8, del: 1.5 },
  { id: 3, top: "7%", left: "74%", size: 2.0, dur: 3.5, del: 0.3 },
  { id: 4, top: "29%", left: "14%", size: 1.5, dur: 2.2, del: 2.1 },
  { id: 5, top: "24%", left: "44%", size: 2.5, dur: 3.0, del: 1.2 },
  { id: 6, top: "34%", left: "81%", size: 2.0, dur: 2.7, del: 0.6 },
  { id: 7, top: "47%", left: "4%", size: 1.5, dur: 3.3, del: 1.8 },
  { id: 8, top: "54%", left: "36%", size: 3.0, dur: 2.1, del: 0.9 },
  { id: 9, top: "50%", left: "64%", size: 2.0, dur: 2.9, del: 2.4 },
  { id: 10, top: "62%", left: "19%", size: 2.5, dur: 3.1, del: 0.4 },
  { id: 11, top: "67%", left: "51%", size: 1.5, dur: 2.6, del: 1.7 },
  { id: 12, top: "71%", left: "86%", size: 2.0, dur: 3.4, del: 0.2 },
  { id: 13, top: "79%", left: "9%", size: 1.5, dur: 2.3, del: 2.8 },
  { id: 14, top: "84%", left: "41%", size: 3.0, dur: 2.8, del: 1.1 },
  { id: 15, top: "77%", left: "69%", size: 2.5, dur: 3.2, del: 0.7 },
  { id: 16, top: "90%", left: "24%", size: 2.0, dur: 2.4, del: 1.9 },
  { id: 17, top: "2%", left: "91%", size: 1.5, dur: 3.6, del: 0.5 },
  { id: 18, top: "40%", left: "93%", size: 2.0, dur: 2.7, del: 2.2 },
  { id: 19, top: "59%", left: "47%", size: 1.5, dur: 3.0, del: 1.4 },
];

function Background({ isDark }: { isDark: boolean | null }) {
  return (
    <>
      <div className="to-background dark:to-background absolute inset-0 bg-linear-to-b from-sky-200/50 via-sky-100/15 via-90% dark:from-sky-950/50 dark:via-sky-900/15 dark:via-90%" />
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-700/20" />
      <div className="absolute bottom-0 -left-12 h-40 w-40 rounded-full bg-indigo-100/50 blur-2xl dark:bg-indigo-900/20" />
      {isDark === false &&
        CLOUDS.map((c) => (
          <div
            key={c.id}
            className="pointer-events-none absolute"
            style={{
              top: c.top,
              left: "-140px",
              animation: `cloudDrift ${c.dur}s linear ${c.del}s infinite`,
            }}
          >
            <CloudShape scale={c.scale} opacity={c.opacity} />
          </div>
        ))}
      {isDark === true &&
        STARS.map((s) => (
          <div
            key={s.id}
            className="pointer-events-none absolute rounded-full bg-white/60 dark:bg-white"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animation: `twinkle ${s.dur}s ease-in-out ${s.del}s infinite`,
            }}
          />
        ))}
    </>
  );
}

function Field({
  label,
  optional,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}{" "}
        {optional ? (
          <span className="text-muted-foreground font-normal">(선택)</span>
        ) : (
          <span className="text-destructive">*</span>
        )}
      </label>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>
            <Icon className="h-4 w-4" />
          </InputGroupText>
        </InputGroupAddon>
        {children}
      </InputGroup>
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}

// ─── Install banner ───────────────────────────────────────────────────────────

function InstallBanner() {
  const [mode, setMode] = useState<"ios" | "android" | null>(null);
  const deferredPrompt = useRef<
    (Event & { prompt: () => Promise<void> }) | null
  >(null);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isIOS) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("ios");
      return;
    }
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as typeof deferredPrompt.current;
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!mode) return null;

  if (mode === "ios") {
    return (
      <div className="bg-background/60 mb-4 rounded-2xl border p-4 backdrop-blur-sm">
        <p className="text-sm font-medium">앱으로 설치해서 사용하기</p>
        <p className="text-muted-foreground mt-1 text-xs">
          하단{" "}
          <Share size={11} className="-mt-0.5 inline" />{" "}
          공유 버튼 → <strong>홈 화면에 추가</strong>를 탭하면
          <br />앱처럼 편하게 사용할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background/60 mb-4 rounded-2xl border p-4 backdrop-blur-sm">
      <p className="text-sm font-medium">앱으로 설치해서 사용하기</p>
      <p className="text-muted-foreground mt-1 mb-3 text-xs">
        홈 화면에 추가하면 앱처럼 편하게 사용할 수 있어요.
      </p>
      <button
        onClick={async () => {
          if (!deferredPrompt.current) return;
          await deferredPrompt.current.prompt();
          setMode(null);
        }}
        className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
      >
        <Download size={12} />
        설치하기
      </button>
    </div>
  );
}

// ─── Login step ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  passcode: z.string().min(1, "패스코드를 입력해주세요"),
});
type LoginForm = z.infer<typeof loginSchema>;

function LoginStep({ onSuccess }: { onSuccess: (session: Session) => void }) {
  const [passcodeError, setPasscodeError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: "", passcode: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    setPasscodeError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, passcode: data.passcode }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      const error: string = json.error ?? "로그인에 실패했습니다";
      if (error === "패스코드가 올바르지 않습니다") {
        setPasscodeError(error);
      } else {
        toast.error(error);
      }
      return;
    }
    onSuccess(await res.json());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="이름" icon={User} error={errors.name?.message}>
        <InputGroupInput
          {...register("name")}
          placeholder="이름"
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field
        label="비밀번호"
        icon={Lock}
        error={passcodeError || errors.passcode?.message}
      >
        <InputGroupInput
          {...register("passcode", { onChange: () => setPasscodeError("") })}
          type="password"
          placeholder="비밀번호"
          aria-invalid={!!(errors.passcode || passcodeError)}
        />
      </Field>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "확인 중…" : "입장하기 →"}
      </Button>
    </form>
  );
}

// ─── Profile step ─────────────────────────────────────────────────────────────

const profileSchema = z.object({
  message: z
    .string()
    .min(1, "한마디를 입력해주세요")
    .max(50, "50자 이하로 입력해주세요"),
});
type ProfileForm = z.infer<typeof profileSchema>;

function ProfileStep({
  session,
  onComplete,
}: {
  session: Session;
  onComplete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { message: "" },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageSrc(URL.createObjectURL(file));
      setCropOpen(true);
      e.target.value = "";
    },
    [],
  );

  const handleCropConfirm = useCallback(
    (blob: Blob) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setCroppedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setCropOpen(false);
    },
    [previewUrl],
  );

  const handleCropCancel = useCallback(() => {
    URL.revokeObjectURL(imageSrc);
    setImageSrc("");
    setCropOpen(false);
  }, [imageSrc]);

  const onSubmit = async (data: ProfileForm) => {
    const patch: { photo_url?: string; message: string } = {
      message: data.message,
    };
    if (croppedBlob) {
      patch.photo_url = await uploadAvatar(session.id, croppedBlob);
    }
    await updateParticipantProfile(session.id, patch);

    const updated: Session = {
      ...session,
      message: data.message,
      photo_url: patch.photo_url ?? session.photo_url,
    };
    setSessionCookie(JSON.stringify(updated));
    onComplete();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-muted-foreground text-center text-sm">
          {session.name}님, 반가워요!
          <br />
          프로필을 완성해주세요.
        </p>

        {/* avatar upload */}
        <div className="flex justify-center pb-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-muted-foreground/30 relative h-20 w-20 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-colors hover:border-sky-400",
              previewUrl && "border-solid border-transparent",
            )}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-1">
                <Camera className="h-5 w-5" />
                <span className="text-[10px]">사진 선택</span>
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <Field
          label="한마디"
          icon={MessageSquare}
          error={errors.message?.message}
        >
          <InputGroupInput
            {...register("message")}
            placeholder="기대돼요!"
            aria-invalid={!!errors.message}
          />
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "저장 중…" : "완료 →"}
        </Button>
      </form>

      <CropDialog
        open={cropOpen}
        imageSrc={imageSrc}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    </>
  );
}

// ─── Gate ─────────────────────────────────────────────────────────────────────

type Step = "checking" | "login" | "profile" | "done";

export function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("checking");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const stored = getSessionCookie();
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep("login");
      return;
    }
    const s: Session = JSON.parse(stored);
    setSession(s);
    setStep(s.photo_url && s.message ? "done" : "profile");
  }, []);

  useEffect(() => {
    if (!session) return;
    const logout = () => {
      deleteSessionCookie();
      setSession(null);
      setStep("login");
    };

    // 포그라운드 복귀 시 서버에서 토큰 유효성 검증
    // Supabase Realtime이 오프라인 중 이벤트를 replay하지 못할 경우를 대비
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/validate-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.id, token: session.token }),
        });
        if (!res.ok) return;
        const { valid } = await res.json();
        if (valid === false) logout();
      } catch {
        // 네트워크 오류(오프라인, cold start 등)는 로그아웃하지 않음
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const channel = supabase
      .channel("kick_watch")
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          if ((payload.old as { id?: string }).id === session.id) logout();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participants",
        },
        (payload) => {
          const updated = payload.new as { id: string; token: string | null };
          if (updated.id === session.id && updated.token === null) logout();
        },
      )
      .subscribe();
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [session]);

  const [isDark, setIsDark] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    return document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (step === "checking")
    return (
      <div className="fixed inset-0 flex items-start">
        <div className="h-0.5 w-full overflow-hidden bg-transparent">
          <div className="h-full animate-[loading-bar_1.2s_ease-in-out_infinite] bg-sky-400" />
        </div>
      </div>
    );
  if (step === "done") return <>{children}</>;

  const handleLoginSuccess = (s: Session) => {
    setSessionCookie(JSON.stringify(s));
    setSession(s);
    setStep(s.photo_url && s.message ? "done" : "profile");
  };

  return (
    <div className="relative mx-auto h-svh max-w-2xl overflow-hidden">
      <Background isDark={isDark} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[3px] uppercase">
            <MapPin className="h-3 w-3" />
            {TRIP_LOCATION}
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{TRIP_NAME}</h1>
          <p className="text-muted-foreground/70 mt-1 text-sm font-medium tracking-[4px] uppercase">
            {TRIP_SUBTITLE}
          </p>
        </div>

        {step === "login" && <InstallBanner />}

        <div className="bg-background/80 rounded-2xl border p-6 shadow-xl backdrop-blur-sm">
          {step === "login" && <LoginStep onSuccess={handleLoginSuccess} />}
          {step === "profile" && session && (
            <ProfileStep session={session} onComplete={() => setStep("done")} />
          )}
        </div>

        {step === "login" && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
            <p className="text-amber-800 dark:text-amber-300 text-xs font-medium">
              로그인이 계속 풀리나요?
            </p>
            <p className="text-amber-700/80 dark:text-amber-400/80 mt-0.5 text-xs">
              브라우저 설정에서 &apos;종료 시 데이터 삭제&apos; 옵션을 꺼주세요.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
