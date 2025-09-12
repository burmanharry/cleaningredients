"use client";

import * as React from "react";
// If you already have a client in "@/lib/supabase", keep this import.
// Otherwise see the comment below to create it.
import { supabase } from "@/lib/supabase";

export default function SignOutButton() {
  const [pending, startTransition] = React.useTransition();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // Kick back to the home page (or /signin) after sign-out
      window.location.assign("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={() => startTransition(handleSignOut)}
      disabled={pending}
      className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
