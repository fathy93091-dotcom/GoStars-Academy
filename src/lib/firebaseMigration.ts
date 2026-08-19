/**
 * GoStars Academy - Firebase Central Data Migration Layer (Stage 3.2)
 *
 * Provides safe, non-destructive migration from isolated local StorageEngine workspaces
 * to normalized Firestore collections, with zero data loss guarantee.
 */

import { migrateWorkspaceToCentralizedFirestore, MigrationSummary } from "./centralDataEngine";
import { StorageEngine } from "./storage";
import { GoStarsBackupData } from "../types";

export interface MigrationStatus {
  hasMigrated: boolean;
  lastMigratedAt?: string;
  totalRecords?: number;
  lastSummary?: MigrationSummary;
}

const MIGRATION_FLAG_KEY = "gostars_central_migration_status";

export function getLocalMigrationStatus(userId?: string): MigrationStatus {
  const key = userId ? `${MIGRATION_FLAG_KEY}_${userId}` : MIGRATION_FLAG_KEY;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read migration status:", e);
  }
  return { hasMigrated: false };
}

export function saveLocalMigrationStatus(status: MigrationStatus, userId?: string): void {
  const key = userId ? `${MIGRATION_FLAG_KEY}_${userId}` : MIGRATION_FLAG_KEY;
  try {
    localStorage.setItem(key, JSON.stringify(status));
  } catch (e) {
    console.warn("Failed to write migration status:", e);
  }
}

/**
 * Executes a safe, verified migration of the user's workspace to Firestore.
 * Preserves LocalStorage and creates a safety snapshot backup prior to execution.
 */
export async function executeSafeMigration(
  userId: string,
  teacherName?: string,
  teacherEmail?: string
): Promise<MigrationSummary> {
  // 1. Take safety snapshot of local data before migration
  const safetyBackup: GoStarsBackupData = StorageEngine.getUserWorkspace(userId);
  try {
    localStorage.setItem(
      `gostars_pre_migration_snapshot_${userId || "guest"}`,
      JSON.stringify(safetyBackup)
    );
  } catch (e) {
    console.warn("Could not save pre-migration snapshot:", e);
  }

  // 2. Perform normalized batch migration to central Firestore collections
  const summary = await migrateWorkspaceToCentralizedFirestore(
    userId,
    teacherName,
    teacherEmail
  );

  // 3. If successful, record migration status
  if (summary.success) {
    const total =
      summary.counts.students +
      summary.counts.groups +
      summary.counts.lessons +
      summary.counts.attendance +
      summary.counts.reports +
      summary.counts.payments;

    saveLocalMigrationStatus(
      {
        hasMigrated: true,
        lastMigratedAt: summary.migratedAt,
        totalRecords: total,
        lastSummary: summary
      },
      userId
    );
  }

  return summary;
}
