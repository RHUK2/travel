const COOKIE_NAME = "travel_session";
const MAX_AGE = 60 * 60 * 24 * 365;

export function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : null;
}

export function setSessionCookie(value: string): void {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)};max-age=${MAX_AGE};path=/;SameSite=Lax`;
}

export function deleteSessionCookie(): void {
  document.cookie = `${COOKIE_NAME}=;max-age=0;path=/;SameSite=Lax`;
}
