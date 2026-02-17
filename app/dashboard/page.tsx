"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowUpRight,
  User,
  LayoutDashboard,
  Store,
  Wallet,
  LogOut,
  Zap,
  ShoppingBag,
  Bell,
  Settings,
} from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ STABLE AUTH FETCH: Forces fresh data to avoid "Old Session" bugs
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        // Prevents browser from caching the 'isSeller: false' state
        cache: 'no-store' 
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        router.replace("/login"); 
      }
    } catch (err) {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      router.push("/login");
    } catch (e) {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-widest text-[10px] animate-pulse">
            Syncing Vault Data...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F4F5] p-4 md:p-8 font-sans text-zinc-900 selection:bg-orange-200">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-8 flex justify-between items-center bg-white border-2 border-black p-4 rounded-[24px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Zap size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter">
              CampusMart
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors hidden md:block">
              <Bell size={20} />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors hidden md:block">
              <Settings size={20} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-all active:translate-y-1"
            >
              Logout <LogOut size={14} />
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-end p-8 md:p-12 bg-white border-2 border-black rounded-[40px] relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <LayoutDashboard size={200} strokeWidth={1} />
            </div>

            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] z-10">
              Control <br />
              <span className="text-orange-500">Center.</span>
            </h1>

            <p className="mt-6 text-zinc-900 font-black uppercase tracking-[0.3em] text-[10px] z-10 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Welcome back, {user.name}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-orange-500 p-8 rounded-[40px] border-2 border-black text-white flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="flex justify-between items-start z-10">
              <div className="w-20 h-20 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <User size={40} className="text-orange-500" />
              </div>

              <span className="bg-black text-white text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.15em] border border-white/20">
                Verified Student
              </span>
            </div>

            <div className="z-10 mt-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-tight truncate">
                {user.name}
              </h2>
              <p className="text-black font-black text-sm mb-4">{user.email}</p>
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-white mb-1">College ID</p>
                <p className="font-mono font-bold tracking-wider text-sm">{user.collegeId}</p>
              </div>
            </div>
          </div>

          {/* --- FIXED CONDITIONAL SELLER PANEL --- */}
          <div className="col-span-12 md:col-span-7 bg-zinc-900 rounded-[40px] border-2 border-black p-8 md:p-10 text-white relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-500/30">
                  <Store size={14} />{" "}
                  {user.isSeller ? "Merchant Mode" : "Earning Potential"}
                </div>

                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4 whitespace-pre-line">
                  {user.isSeller
                    ? "Manage Your\nInventory"
                    : "Start Your\nSide Hustle"}
                </h3>

                <p className="text-zinc-400 max-w-sm text-sm font-bold leading-relaxed">
                  {user.isSeller
                    ? "Review listings, adjust pricing, and track your campus sales effortlessly."
                    : "Turn your old textbooks and gadgets into cash. It only takes 2 minutes to list."}
                </p>
              </div>

              <div className="mt-10">
                <Link
                  // ✅ LINK FIX: Branches to the correct page based on state
                  href={user.isSeller ? "/seller" : "/become-seller"}
                  className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs border-2 border-white hover:bg-orange-500 hover:text-white hover:border-black transition-all duration-300 group-hover:-translate-y-1"
                >
                  {/* ✅ TEXT FIX: Dynamic Label */}
                  {user.isSeller ? "Enter Merchant Vault" : "Become a Seller"}
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          </div>

          <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[32px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group hover:bg-orange-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-orange-100 border-2 border-black flex items-center justify-center text-orange-600 mb-6 group-hover:rotate-6 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter">00</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Total Orders</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[32px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group hover:bg-emerald-50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-black flex items-center justify-center text-emerald-600 mb-6 group-hover:-rotate-6 transition-transform">
                <Wallet size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-black tracking-tighter">₹0</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Total Spent</span>
              </div>
            </div>

            <div className="col-span-2 bg-zinc-100 border-2 border-dashed border-black/20 p-8 rounded-[40px] flex flex-col items-center justify-center text-center">
              <div className="bg-white p-3 rounded-2xl border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <LayoutDashboard size={24} className="text-zinc-900" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-900">No recent marketplace activity</p>
              <Link href="/products" className="mt-3 text-xs font-black text-orange-500 hover:underline">
                Browse Shop →
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">
            CampusMart Platform © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}