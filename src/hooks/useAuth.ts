"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const { user, loading, error, signIn, signUp, signOut, initializeAuth } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };
}
