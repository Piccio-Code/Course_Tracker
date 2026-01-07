"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  // Mostra loading mentre verifica la sessione
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500"></div>
          <p className="text-white/60">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Se non c'è sessione, non mostrare niente (il redirect è già in corso)
  if (!session) {
    return null;
  }

  // Mostra il contenuto protetto
  return <>{children}</>;
}

