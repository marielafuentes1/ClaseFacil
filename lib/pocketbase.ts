import PocketBase from "pocketbase"

// Singleton instance
let pb: PocketBase | null = null

export function getPocketBase() {
  if (!pb) {
    const url = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://10.56.2.13:8090"
    pb = new PocketBase(url)

    // Auto-refresh authentication
    pb.autoCancellation(false)
  }

  return pb
}

// Export for convenience
export const pocketbase = getPocketBase()
