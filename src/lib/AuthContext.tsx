import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  logoutFirebase,
  syncUserProfile,
  subscribeToUserProfile,
  updateUserRole as firebaseUpdateUserRole
} from "./firebase";
import { UserProfile, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isSupervisor: boolean;
  isTeacher: boolean;
  isParent: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  updateRole: (targetUid: string, newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let isMounted = true;

    // Safety timeout: Never keep the app locked on "verifying" for more than 1.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 1500);

    const unsubscribeAuth = onAuthStateChanged(auth, async currentUser => {
      clearTimeout(safetyTimer);
      if (!isMounted) return;
      
      setUser(currentUser);
      setError(null);

      if (currentUser) {
        try {
          // Initialize or fetch user profile (with non-blocking 0ms cache)
          const synced = await syncUserProfile(currentUser);
          if (isMounted) {
            setProfile(synced);
          }

          // Real-time listener for profile/role updates
          if (unsubscribeProfile) unsubscribeProfile();
          unsubscribeProfile = subscribeToUserProfile(currentUser.uid, updated => {
            if (updated && isMounted) {
              setProfile(updated);
            }
          });
        } catch (err: any) {
          console.warn("Auth initialization notice:", err?.message || err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        if (isMounted) {
          setProfile(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const loginWithGoogle = async (preferredRole?: UserRole): Promise<UserProfile | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const googleUser = await firebaseSignInWithGoogle();
      const synced = await syncUserProfile(googleUser, preferredRole);
      setProfile(synced);
      return synced;
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "Failed to sign in with Google");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutFirebase();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
      setError(err?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (targetUid: string, newRole: UserRole) => {
    try {
      await firebaseUpdateUserRole(targetUid, newRole);
    } catch (err: any) {
      console.error("Update role failed:", err);
      setError(err?.message || "Failed to update role");
      throw err;
    }
  };

  const isMasterAdminEmail = Boolean(
    user?.email && user.email.toLowerCase() === "fathy93091@gmail.com"
  );
  const role = isMasterAdminEmail ? "admin" : (profile?.role || null);
  const isAdmin = role === "admin" || isMasterAdminEmail;
  const isSupervisor = role === "supervisor" || isAdmin;
  const isTeacher = role === "teacher" || isSupervisor;
  const isParent = role === "parent" && !isAdmin && !isSupervisor && !isTeacher;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAdmin,
        isSupervisor,
        isTeacher,
        isParent,
        isLoading,
        error,
        loginWithGoogle,
        logout,
        updateRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
