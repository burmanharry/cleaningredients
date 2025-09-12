// components/Header.tsx
"use client";


import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase"; // client-side supabase
import SignOutButton from "@/components/SignOutButton";


export default function Header() {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);


 useEffect(() => {
   // Get initial session
   const getUser = async () => {
     try {
       const { data: { user } } = await supabase.auth.getUser();
       setUser(user);
     } catch (error) {
       console.error("Error fetching user:", error);
       setUser(null);
     } finally {
       setLoading(false);
     }
   };


   getUser();


   // Listen for auth changes
   const { data: { subscription } } = supabase.auth.onAuthStateChange(
     (event, session) => {
       setUser(session?.user ?? null);
       setLoading(false);
     }
   );


   return () => subscription.unsubscribe();
 }, []);


 return (
   <header className="fixed inset-x-0 top-0 z-30 border-b border-white/20 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
     <div className="mx-auto max-w-6xl px-6">
       <div className="flex h-16 items-center justify-between gap-4">
         <Link href="/" className="text-lg font-semibold tracking-tight">
           CleanIngredients
         </Link>


         <nav className="hidden items-center gap-6 text-base sm:flex">
           <Link href="/ingredients" className="hover:underline">Browse</Link>
           <Link href="/information" className="hover:underline">Information</Link>
           <Link href="/FAQ" className="hover:underline">FAQ</Link>
         </nav>


         <div className="flex items-center gap-3">
           {loading ? (
             // Show loading state
             <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
           ) : user ? (
             <>
               <Link
                 href="/account"
                 className="hidden text-base hover:underline sm:inline"
                 title={user.email ?? "Account"}
               >
                 {user.email}
               </Link>
               <SignOutButton />
             </>
           ) : (
             <Link
               href="/signin"
               className="rounded-full border px-3 py-1.5 text-base shadow-sm hover:bg-neutral-50"
             >
               Sign in
             </Link>
           )}
         </div>
       </div>
     </div>
   </header>
 );
}

