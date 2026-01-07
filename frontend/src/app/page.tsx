"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { BookOpen, TrendingUp, Target, UserPlus, Cloud, BarChart3, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-violet-950">
      <Navbar />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Hero Section */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 pt-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Title */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span>Course</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Tracker
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-white/70 drop-shadow-md md:text-2xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Trasforma i tuoi corsi OneDrive in un percorso di apprendimento organizzato. 
            Traccia i progressi, raggiungi obiettivi, celebra i successi.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Link 
              href="/signup"
              className="group relative rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-violet-500/25 transition-[transform,shadow] duration-200 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-105 will-change-transform"
            >
              <span className="relative z-10">Inizia Gratuitamente</span>
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
        <section id="features" className="mt-32 scroll-mt-20">
          <div className="text-center mb-16">
            <p className="text-violet-400 font-semibold mb-3 uppercase tracking-wider text-sm">Caratteristiche</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Tutto ciò di cui hai bisogno</h2>
          </div>
          
          <div className="grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <BookOpen className="w-7 h-7 text-violet-400" />
              </div>
              <div className="mb-3">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Organizzazione</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Traccia i Corsi</h3>
              <p className="text-white/60 leading-relaxed">
                Organizza tutti i tuoi corsi OneDrive in un unico posto, con struttura gerarchica e risorse sempre accessibili
              </p>
            </div>
            
            <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <TrendingUp className="w-7 h-7 text-fuchsia-400" />
              </div>
              <div className="mb-3">
                <span className="text-xs font-semibold text-fuchsia-400 uppercase tracking-wider">Analytics</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Monitora i Progressi</h3>
              <p className="text-white/60 leading-relaxed">
                Visualizza in tempo reale quanto hai visto, quanto manca e quanto tempo hai dedicato al tuo apprendimento
              </p>
            </div>
            
            <div className="group rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-[transform,background-color,border-color] duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105 will-change-transform">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                <Target className="w-7 h-7 text-pink-400" />
              </div>
              <div className="mb-3">
                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Motivazione</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Raggiungi Obiettivi</h3>
              <p className="text-white/60 leading-relaxed">
                Definisci obiettivi chiari, celebra ogni traguardo e mantieni alta la motivazione nel tuo percorso
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-32 scroll-mt-20 pb-32">
          <div className="text-center mb-20">
            <p className="text-violet-400 font-semibold mb-3 uppercase tracking-wider text-sm">Processo</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Come Funziona</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Inizia a tracciare i tuoi corsi in 4 semplici passaggi
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            {/* Desktop: Horizontal Timeline */}
            <div className="hidden md:block relative">
              {/* Connection Line */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/40 to-violet-500/20" />
              
              <div className="grid grid-cols-4 gap-8">
                {/* Step 1 */}
                <div className="relative text-center group">
                  <div className="relative mb-6 inline-flex">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-violet-400/50">
                      <UserPlus className="w-12 h-12 text-violet-400 mb-2" />
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Registrati</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Crea il tuo account gratuito in pochi secondi
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative text-center group">
                  <div className="relative mb-6 inline-flex">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-fuchsia-400/50">
                      <Cloud className="w-12 h-12 text-fuchsia-400 mb-2" />
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Importa Corsi</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Collega OneDrive e aggiungi i tuoi corsi video
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative text-center group">
                  <div className="relative mb-6 inline-flex">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-pink-400/50">
                      <BarChart3 className="w-12 h-12 text-pink-400 mb-2" />
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Traccia Progressi</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Guarda i video e segna automaticamente il progresso
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative text-center group">
                  <div className="relative mb-6 inline-flex">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-violet-400/50">
                      <Trophy className="w-12 h-12 text-violet-400 mb-2" />
                      <span className="text-3xl font-bold text-white">4</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Raggiungi Obiettivi</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Completa corsi e celebra i tuoi successi
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile: Vertical Timeline */}
            <div className="md:hidden space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                    <UserPlus className="w-8 h-8 text-violet-400 mb-1" />
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-white mb-1">Registrati</h3>
                  <p className="text-white/60 text-sm">
                    Crea il tuo account gratuito in pochi secondi
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-10 w-0.5 h-8 bg-gradient-to-b from-violet-500/40 to-fuchsia-500/20" />

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Cloud className="w-8 h-8 text-fuchsia-400 mb-1" />
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-white mb-1">Importa Corsi</h3>
                  <p className="text-white/60 text-sm">
                    Collega OneDrive e aggiungi i tuoi corsi video
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-10 w-0.5 h-8 bg-gradient-to-b from-fuchsia-500/40 to-pink-500/20" />

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-pink-400 mb-1" />
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-white mb-1">Traccia Progressi</h3>
                  <p className="text-white/60 text-sm">
                    Guarda i video e segna automaticamente il progresso
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="ml-10 w-0.5 h-8 bg-gradient-to-b from-pink-500/40 to-violet-500/20" />

              {/* Step 4 */}
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Trophy className="w-8 h-8 text-violet-400 mb-1" />
                    <span className="text-xl font-bold text-white">4</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-white mb-1">Raggiungi Obiettivi</h3>
                  <p className="text-white/60 text-sm">
                    Completa corsi e celebra i tuoi successi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Final CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Intense gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/30 to-violet-600/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/50 to-black" />
        
        {/* Decorative blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Pronto a trasformare il tuo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              apprendimento
            </span>?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Unisciti a chi ha già scelto di tracciare i propri progressi e raggiungere obiettivi di apprendimento ambiziosi
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-12 py-5 text-xl font-bold text-white rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-2xl shadow-violet-500/50 transition-[transform,shadow] duration-300 hover:shadow-violet-500/70 hover:scale-105"
          >
            Inizia Gratuitamente
            <Target className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-white/50">
            Nessuna carta di credito richiesta • Configurazione in 2 minuti
          </p>
        </div>
      </section>
      
      {/* Footer legale - GDPR Compliance */}
      <Footer />
    </div>
  );
}
