/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  emailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredential.user.getIdToken();

          // Create session on server
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          // Verify and get user data
          const response = await fetch("/api/auth/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            throw new Error("فشل في التحقق من المستخدم");
          }

          const data = await response.json();
          set({ user: data.user, loading: false, initialized: true });
        } catch (error: any) {
          console.error("Sign in error:", error);
          set({
            error: error.message || "فشل في تسجيل الدخول",
            loading: false,
            initialized: true,
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string, displayName?: string) => {
        set({ loading: true, error: null });
        try {
          // Create account on server
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, displayName }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "فشل في إنشاء الحساب");
          }

          // Sign in after successful registration
          await get().signIn(email, password);
        } catch (error: any) {
          console.error("Sign up error:", error);
          set({
            error: error.message || "فشل في إنشاء الحساب",
            loading: false,
            initialized: true,
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          // Clear session on server first
          await fetch("/api/auth/signout", {
            method: "POST",
          });

          // Then sign out from Firebase
          await firebaseSignOut(auth);

          // Clear local state
          set({ user: null, loading: false, initialized: true });

          // Clear localStorage auth data
          localStorage.removeItem("auth-storage");
        } catch (error: any) {
          console.error("Sign out error:", error);
          set({
            error: error.message || "فشل في تسجيل الخروج",
            loading: false,
            initialized: true,
          });
          throw error;
        }
      },

      setUser: (user: AuthUser | null) => {
        set({ user, loading: false, initialized: true });
      },

      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
              try {
                const idToken = await firebaseUser.getIdToken();

                const response = await fetch("/api/auth/verify-token", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ idToken }),
                });

                if (response.ok) {
                  const data = await response.json();
                  set({ user: data.user, loading: false, initialized: true });
                } else {
                  set({ user: null, loading: false, initialized: true });
                }
              } catch (error) {
                console.error("Error initializing auth:", error);
                set({ user: null, loading: false, initialized: true });
              }
            } else {
              set({ user: null, loading: false, initialized: true });
            }
          }
        );

        return unsubscribe;
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
