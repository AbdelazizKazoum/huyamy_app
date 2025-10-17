/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithEmailAndPassword,
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

interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  address: string;
  city: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (data: SignUpData) => Promise<void>;
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

          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          const response = await fetch("/api/auth/verify-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "auth/generic");
          }

          const data = await response.json();
          set({ user: data.user, loading: false, error: null });
          return null; // Success, no error
        } catch (error: any) {
          let code = "auth/generic";
          if (error.code) {
            code = error.code;
          } else if (error.message && error.message.includes("auth/")) {
            const codeMatch = error.message.match(/auth\/[a-zA-Z0-9\-]+/);
            if (codeMatch) {
              code = codeMatch[0];
            }
          }
          set({ error: code, loading: false });
          return code; // e.g. "auth/invalid-credential"
        }
      },

      signUp: async (data: SignUpData) => {
        set({ loading: true, error: null });
        try {
          // Use data.email, data.password, data.displayName, data.address, data.city, data.phone
          // Example:
          // await createUserWithEmailAndPassword(auth, data.email, data.password);
          // Save additional fields to your backend as needed
          set({ loading: false });
        } catch (error: any) {
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
