import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  logoutFirebase,
  syncUserProfile,
  subscribeToUserProfile,
  updateUserRole as firebaseUpdateUserRole,
  saveSessionLocally,
  getSavedSessionLocally,
  clearSavedSessionLocally,
  MASTER_ADMIN_EMAIL
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
  // 1. Instantly initialize from local persistent session if available on this device
  const [user, setUser] = useState<User | null>(() => {
    const saved = getSavedSessionLocally();
    if (saved && saved.uid) {
      // Provide a fast fallback User stub while Firebase SDK completes local token verification
      return {
        uid: saved.uid,
        email: saved.email,
        displayName: saved.displayName,
        photoURL: saved.photoURL,
        emailVerified: true
      } as unknown as User;
    }
    return null;
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = getSavedSessionLocally();
    if (saved && saved.uid) {
      try {
        const cachedProfile = localStorage.getItem(`gostars_profile_${saved.uid}`);
        if (cachedProfile) {
          return JSON.parse(cachedProfile);
        }
      } catch {}
      return {
        uid: saved.uid,
        role: saved.role || (saved.email?.toLowerCase() === MASTER_ADMIN_EMAIL ? "admin" : "parent"),
        name: saved.displayName || "مستخدم مسجل",
        email: saved.email || "",
        status: "active",
        createdAt: new Date(saved.lastLogin || Date.now()).toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    return null;
  });

  // If we already have a saved session, we don't block the screen with a loader
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const saved = getSavedSessionLocally();
    return !saved;
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let isMounted = true;

    // Safety timeout: Never keep the app locked on "verifying" for more than 800ms
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 800);

    const unsubscribeAuth = onAuthStateChanged(auth, async currentUser => {
      clearTimeout(safetyTimer);
      if (!isMounted) return;

      if (currentUser) {
        setUser(currentUser);
        setError(null);

        try {
          // Initialize or fetch user profile
          const synced = await syncUserProfile(currentUser);
          if (isMounted) {
            setProfile(synced);

            // Persist session to device storage
            saveSessionLocally({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: synced.role,
              lastLogin: Date.now()
            });
          }

          // Real-time listener for profile/role updates
          if (unsubscribeProfile) unsubscribeProfile();
          unsubscribeProfile = subscribeToUserProfile(currentUser.uid, updated => {
            if (updated && isMounted) {
              setProfile(updated);
              saveSessionLocally({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                role: updated.role,
                lastLogin: Date.now()
              });
            }
          });
        } catch (err: any) {
          console.warn("Auth sync notice:", err?.message || err);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        // Only if there is no locally saved session or if token is explicitly gone
        const existingSession = getSavedSessionLocally();
        if (!existingSession) {
          if (unsubscribeProfile) unsubscribeProfile();
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setIsLoading(false);
          }
        } else {
          if (isMounted) {
            setIsLoading(false);
          }
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
      
      setUser(googleUser);
      setProfile(synced);

      // Save persistent session locally
      saveSessionLocally({
        uid: googleUser.uid,
        email: googleUser.email,
        displayName: googleUser.displayName,
        photoURL: googleUser.photoURL,
        role: synced.role,
        lastLogin: Date.now()
      });

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
      clearSavedSessionLocally();
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
      if (user && user.uid === targetUid) {
        const updated = { ...profile, role: newRole } as UserProfile;
        setProfile(updated);
        saveSessionLocally({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: newRole,
          lastLogin: Date.now()
        });
      }
    } catch (err: any) {
      console.error("Update role failed:", err);
      setError(err?.message || "Failed to update role");
      throw err;
    }
  };

  const isMasterAdminEmail = Boolean(
    user?.email && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
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
