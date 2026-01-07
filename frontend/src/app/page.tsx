"use client";

import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-violet-950">
      
      {/* Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            <span>Course</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Tracker
            </span>
          </h1>
          
          <p className="mb-12 text-xl text-white/70 drop-shadow-md md:text-2xl max-w-xl mx-auto">
            La piattaforma definitiva per tracciare il tuo percorso di apprendimento
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link 
              href="/signup"
              className="group relative rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-violet-500/25 transition-[transform,shadow] duration-200 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-105 will-change-transform"
            >
              <span className="relative z-10">Inizia Ora</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
            <Link 
              href="/login"
              className="rounded-full border-2 border-white/30 bg-white/5 px-10 py-4 text-lg font-semibold text-white shadow-xl backdrop-blur-sm transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/50 hover:scale-105 will-change-transform"
            >
              Accedi
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="mt-32 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
              📚
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Traccia i Corsi</h3>
            <p className="text-white/60 leading-relaxed">
              Organizza tutti i tuoi corsi in un unico posto, con note e risorse
            </p>
          </div>
          
          <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
              📊
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Monitora i Progressi</h3>
            <p className="text-white/60 leading-relaxed">
              Visualizza i tuoi progressi con grafici e statistiche dettagliate
            </p>
          </div>
          
          <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-3xl">
              🎯
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">Raggiungi Obiettivi</h3>
            <p className="text-white/60 leading-relaxed">
              Definisci e conquista i tuoi obiettivi di apprendimento
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer legale - GDPR Compliance */}
      <Footer />
    </div>
  );
}
