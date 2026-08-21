import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  User
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { GoStarsBackupData, UserProfile, UserRole } from "../types";

// Master Admin Email Configuration
export const MASTER_ADMIN_EMAIL = "fathy93091@gmail.com";

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics conditionally (safely in browser environments)
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export const auth = getAuth(app);

// Enforce permanent browser/device persistence (LocalStorage / IndexedDB) across app reloads and phone restarts
if (typeof window !== "undefined") {
  try {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn("Auth persistence configuration note:", err);
    });
  } catch (err) {
    console.warn("Auth setPersistence notice:", err);
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Local persistent session storage keys
export const SESSION_STORAGE_KEY = "gostars_active_session_v1";

export interface SavedUserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  lastLogin: number;
}

export function saveSessionLocally(session: SavedUserSession): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export function getSavedSessionLocally(): SavedUserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

export function clearSavedSessionLocally(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}

// Initialize Firestore Database (default instance)
export const db = getFirestore(app);

// Get User Profile from Firestore or cache
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  
  // Try local cache first for instant resolution
  const cacheKey = `gostars_profile_${uid}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {}

  try {
    const userDocRef = doc(db, "users", uid);
    // 2-second timeout to prevent any UI freezing on slow networks
    const snapPromise = getDoc(userDocRef);
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1800));
    
    const snap: any = await Promise.race([snapPromise, timeoutPromise]);
    
    if (snap && snap.exists && snap.exists()) {
      const data = snap.data();
      const profile: UserProfile = {
        uid: data.uid || uid,
        role: (data.role as UserRole) || (data.email === MASTER_ADMIN_EMAIL ? "admin" : "parent"),
        name: data.name || data.displayName || "مستخدم الأكاديمية",
        email: data.email || "",
        status: data.status || "active",
        photoURL: data.photoURL || undefined,
        phoneNumber: data.phoneNumber || undefined,
        assignedTeacherId: data.assignedTeacherId || undefined,
        assignedStudentIds: data.assignedStudentIds || undefined,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      };
      try {
        localStorage.setItem(cacheKey, JSON.stringify(profile));
      } catch {}
      return profile;
    }
    return null;
  } catch (error: any) {
    console.warn("Firestore getUserProfile notice:", error?.message || error);
    return null;
  }
}

// Sync or Initialize User Profile upon Authentication
export async function syncUserProfile(
  user: User,
  preferredRole?: UserRole
): Promise<UserProfile> {
  const isMaster = user.email && user.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();
  const existing = await getUserProfile(user.uid);
  const now = new Date().toISOString();

  // Determine role: Master admin email always gets admin role immediately
  let assignedRole: UserRole = isMaster ? "admin" : "parent";
  if (existing?.role) {
    assignedRole = isMaster ? "admin" : existing.role;
  } else if (preferredRole) {
    assignedRole = isMaster ? "admin" : (preferredRole === "teacher" ? "teacher" : "parent");
  }

  const profile: UserProfile = {
    uid: user.uid,
    role: assignedRole,
    name: user.displayName || existing?.name || (user.email ? user.email.split("@")[0] : "مستخدم"),
    email: user.email || existing?.email || "",
    status: existing?.status || "active",
    photoURL: user.photoURL || existing?.photoURL || undefined,
    phoneNumber: user.phoneNumber || existing?.phoneNumber || undefined,
    assignedTeacherId: existing?.assignedTeacherId,
    assignedStudentIds: existing?.assignedStudentIds,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  // Cache locally immediately for 0ms access
  try {
    localStorage.setItem(`gostars_profile_${user.uid}`, JSON.stringify(profile));
  } catch {}

  // Sync to Firestore in background without blocking
  (async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        cleanPayloadForFirestore({
          ...profile,
          updatedAt: now
        }),
        { merge: true }
      );
    } catch (err: any) {
      console.warn("Firestore syncUserProfile background notice:", err?.message || err);
    }
  })();

  return profile;
}

// Subscribe to User Profile in Real-time
export function subscribeToUserProfile(
  uid: string,
  onProfileChange: (profile: UserProfile | null) => void
) {
  if (!uid) return () => {};

  try {
    const userDocRef = doc(db, "users", uid);
    return onSnapshot(
      userDocRef,
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          const profile: UserProfile = {
            uid: data.uid || uid,
            role: (data.role as UserRole) || (data.email === MASTER_ADMIN_EMAIL ? "admin" : "parent"),
            name: data.name || data.displayName || "مستخدم الأكاديمية",
            email: data.email || "",
            status: data.status || "active",
            photoURL: data.photoURL || undefined,
            phoneNumber: data.phoneNumber || undefined,
            assignedTeacherId: data.assignedTeacherId || undefined,
            assignedStudentIds: data.assignedStudentIds || undefined,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          };
          onProfileChange(profile);
        } else {
          onProfileChange(null);
        }
      },
      error => {
        console.warn("Firestore profile subscription notice:", error?.message || error);
      }
    );
  } catch (err: any) {
    console.warn("Profile listener initialization notice:", err?.message || err);
    return () => {};
  }
}

// Update Role (Admin action)
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  if (!targetUid) return;
  const userDocRef = doc(db, "users", targetUid);
  await updateDoc(userDocRef, {
    role: newRole,
    updatedAt: new Date().toISOString()
  });
}

// Update Supervisor Permissions (Admin action)
export async function updateSupervisorPermissions(
  targetUid: string,
  permissions: any
): Promise<void> {
  if (!targetUid) return;
  const userDocRef = doc(db, "users", targetUid);
  await setDoc(
    userDocRef,
    cleanPayloadForFirestore({
      permissions,
      updatedAt: new Date().toISOString()
    }),
    { merge: true }
  );
}

// Google Sign-In
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase Google Auth error:", error);
    throw error;
  }
}

// Sign Out
export async function logoutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// Sanitize object for Firestore (recursively strip undefined and non-serializable fields)
export function cleanPayloadForFirestore<T>(data: T): any {
  if (data === null || data === undefined) return null;
  return JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
}

// Firestore User Data Sync Engine
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
let lastSavedHash: string = "";

export function subscribeToUserData(
  userId: string,
  onData: (data: GoStarsBackupData | null) => void
) {
  if (!userId) return () => {};

  try {
    const userDocRef = doc(db, "users", userId);
    return onSnapshot(
      userDocRef,
      snapshot => {
        if (snapshot.exists()) {
          onData(snapshot.data() as GoStarsBackupData);
        } else {
          onData(null);
        }
      },
      error => {
        // Silently handle transient connection/permission errors while user authenticates
        console.warn("Firestore subscription note:", error?.message || error);
      }
    );
  } catch (err: any) {
    console.warn("Firestore listener initialization note:", err?.message || err);
    return () => {};
  }
}

export async function saveUserDataToFirestore(
  userId: string,
  data: GoStarsBackupData
): Promise<void> {
  if (!userId) return;

  const currentHash = JSON.stringify(data);
  if (currentHash === lastSavedHash) {
    return; // No change in data
  }

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    try {
      lastSavedHash = currentHash;
      const userDocRef = doc(db, "users", userId);
      const cleanData = cleanPayloadForFirestore(data);
      
      await setDoc(
        userDocRef,
        {
          ...cleanData,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch (error: any) {
      console.warn("Firestore sync note:", error?.message || error);
    }
  }, 1500);
}

export { onAuthStateChanged };
export type { User };

