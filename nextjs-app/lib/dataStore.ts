// Simple in-memory data store
// In production, use Redis, Database, or proper state management

let syncedData: any = null

export function setSyncedData(data: any) {
  syncedData = data
}

export function getSyncedData() {
  return syncedData
}

export function clearSyncedData() {
  syncedData = null
}
