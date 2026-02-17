"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Zap, GraduationCap } from "lucide-react";

export default function BecomeSellerPage() {
  const router = useRouter();
  const [collegeId, setCollegeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Check login status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok || !data.user) {
          router.push("/login");
          return;
        }
        
        // If already a seller, go straight to inventory
        if (data.user.isSeller) {
          router.push("/seller");
          return;
        }

        setLoading(false);
      } catch (err) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // ✅ Submit Logic
  const handleBecomeSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeId) return alert("College ID is required ❌");

    setSubmitting(true);
    try {
      const res = await fetch("/api/seller/become", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        // ✅ CRITICAL FIX: Hard refresh to clear the "isSeller: false" session cache
        // Using window.location forces Next.js to re-run the middleware and server-side checks
        window.location.href = "/seller"; 
      } else {
        const data = await res.json();
        alert(data.message || "Activation failed ❌");
      }
    } catch (err) {
      alert("Server connection lost ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#F4F4F5]">
        <div className="w-12 h-12 border-4 border-black border-t-orange-500 rounded-full animate-spin mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
        <p className="font-black uppercase tracking-widest text-xs">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#F4F4F5] p-6 font-sans">
      <div className="w-full max-w-lg">
        
        {/* --- BRANDING --- */}
        <div className="flex justify-center mb-10">
            <div className="bg-black text-white p-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]">
                <Zap fill="currentColor" />
            </div>
        </div>

        <form
          onSubmit={handleBecomeSeller}
          className="bg-white p-8 md:p-12 border-4 border-black rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <GraduationCap size={120} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
            Activate <br /> <span className="text-orange-500">Merchant Mode.</span>
          </h1>
          <p className="text-zinc-500 font-bold text-sm mb-10 uppercase tracking-widest">
            Verify your identity to start trading
          </p>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-1">College ID Number</label>
              <input
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="Ex: 21BCE091"
                className="w-full border-2 border-black p-4 rounded-2xl font-bold bg-zinc-50 outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(249,115,22,1)] transition-all placeholder:text-zinc-300"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 border-2 border-black hover:bg-orange-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
            >
              {submitting ? "Processing..." : <>Confirm Activation <ArrowRight size={18} /></>}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-dashed border-zinc-200 flex items-center gap-3 text-zinc-400">
            <ShieldCheck size={20} className="text-green-500" />
            <p className="text-[10px] font-bold uppercase leading-tight">
              Your data is encrypted and used only for campus verification.
            </p>
          </div>
        </form>

        <p className="mt-8 text-center text-zinc-400 font-black uppercase text-[10px] tracking-[0.3em]">
          CampusMart Security Protocol © 2026
        </p>
      </div>
    </div>
  );
}