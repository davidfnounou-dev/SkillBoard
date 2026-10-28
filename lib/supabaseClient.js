import { createClient } from "@supabase/supabase-js";

// Reads your keys from .env.local (see .env.local.example).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Friendly nudge if you forgot to set up .env.local
  console.warn(
    "Supabase keys are missing. Copy .env.local.example to .env.local and fill it in."
  );
}

// Did the person arrive from the "reset password" email link? We check this
// BEFORE createClient, because Supabase removes the token from the URL as soon
// as it starts, and the PASSWORD_RECOVERY event can fire before React is ready.
export const openedFromRecoveryLink =
  typeof window !== "undefined" &&
  /(^|[#&?])type=recovery/.test(window.location.hash + window.location.search);

// New-style recovery link: ?token_hash=...&type=recovery (safe from email scanners,
// because the token is only spent when the person presses a button).
const _params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
export const recoveryTokenHash =
  _params && _params.get("type") === "recovery" ? _params.get("token_hash") : null;

// Expired / already-used link: Supabase puts the error in the URL hash.
export const linkError =
  typeof window !== "undefined" && /error_code=(otp_expired|access_denied)/.test(window.location.hash)
    ? "expired"
    : null;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
