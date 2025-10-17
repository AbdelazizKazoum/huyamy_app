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
import { useTranslations } from "next-intl";

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

const firebaseErrorMap: Record<string, string> = {
  "auth/invalid-credential": "بيانات الدخول غير صحيحة.",
  "auth/user-not-found": "المستخدم غير موجود.",
  "auth/wrong-password": "كلمة المرور غير صحيحة.",
  "auth/too-many-requests": "تم حظر المحاولة مؤقتًا. حاول لاحقًا.",
  "auth/network-request-failed": "خطأ في الاتصال بالإنترنت.",
  // Add more mappings as needed
};

function getAuthErrorMessage(code: string, t: any): string {
  switch (code) {
    case "auth/user-not-found":
      return t("auth.userNotFound");
    case "auth/wrong-password":
      return t("auth.wrongPassword");
    case "auth/invalid-email":
      return t("auth.invalidEmail");
    case "auth/invalid-credential":
      return t("auth.invalidCredential");
    case "auth/too-many-requests":
      return t("auth.tooManyRequests");
    default:
      return t("auth.generic");
  }
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
          return null; // No error
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
          return code;
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
