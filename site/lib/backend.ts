/* Backend wiring. Set ZEPHYR_BACKEND_URL (+ optional ZEPHYR_BACKEND_KEY)
   in .env.local to route jobs/papers to a real backend; leave unset and the
   built-in simulation keeps the demo working. Contract: see DECISIONS.md. */

export const BACKEND_URL = (process.env.ZEPHYR_BACKEND_URL ?? "").replace(
  /\/+$/,
  "",
);
export const hasBackend = Boolean(BACKEND_URL);

export function backendHeaders(): Record<string, string> {
  const key = process.env.ZEPHYR_BACKEND_KEY;
  return key ? { Authorization: `Bearer ${key}` } : {};
}
