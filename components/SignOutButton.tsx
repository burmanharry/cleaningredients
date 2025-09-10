// components/SignOutButton.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.refresh(); // Refresh the page to update UI
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-full border px-3 py-1.5 text-base shadow-sm hover:bg-neutral-50 disabled:opacity-50"
    >
      {loading ? "..." : "Sign out"}
    </button>
  );
}