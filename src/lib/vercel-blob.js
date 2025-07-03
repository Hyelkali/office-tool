import { put, del, list } from "@vercel/blob"

const BLOB_READ_WRITE_TOKEN = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN

if (!BLOB_READ_WRITE_TOKEN) {
  console.warn("VITE_BLOB_READ_WRITE_TOKEN not found. File uploads will not work.")
}

export async function uploadFile(file, filename) {
  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error("Blob token not configured")
  }

  try {
    const blob = await put(filename, file, {
      access: "public",
      token: BLOB_READ_WRITE_TOKEN,
    })
    return blob.url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export async function deleteFile(url) {
  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error("Blob token not configured")
  }

  try {
    await del(url, { token: BLOB_READ_WRITE_TOKEN })
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

export async function listFiles() {
  if (!BLOB_READ_WRITE_TOKEN) {
    throw new Error("Blob token not configured")
  }

  try {
    const { blobs } = await list({ token: BLOB_READ_WRITE_TOKEN })
    return blobs
  } catch (error) {
    console.error("Error listing files:", error)
    throw error
  }
}
