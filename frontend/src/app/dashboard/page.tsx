"use client";

import PageBackground from "@/components/PageBackground";
import { getUser, logout, User } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getUser();
      
      if (!currentUser) {
        // Non autenticato, redirect a login
        router.push("/login");
        return;
      }
      
      setUser(currentUser);
      setIsLoading(false);
    }
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black">
        <PageBackground />
        <main className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-white">
            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-lg">Caricamento...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <PageBackground />
      
      <main className="relative z-10 min-h-screen px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between max-w-6xl mx-auto mb-12">
          <h1 className="text-2xl font-bold text-white">
            Course<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Hub</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{user?.username}</p>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white/80 transition-all hover:bg-white/10 hover:border-white/20"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Benvenuto, {user?.username}! 👋
            </h2>
            <p className="text-white/60 mb-8">
              Gestisci i tuoi corsi e monitora i progressi
            </p>

            {/* Placeholder content */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-white mb-1">I tuoi Corsi</h3>
                <p className="text-white/60 text-sm">Nessun corso ancora</p>
              </div>
              
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-white mb-1">Progressi</h3>
                <p className="text-white/60 text-sm">Inizia un corso per vedere i progressi</p>
              </div>
              
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-4xl mb-3">➕</div>
                <h3 className="text-lg font-semibold text-white mb-1">Aggiungi Corso</h3>
                <p className="text-white/60 text-sm">Clicca per aggiungere un nuovo corso</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

