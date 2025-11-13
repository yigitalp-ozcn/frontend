import { createClient } from '@supabase/supabase-js'

// Environment variables - Add these to your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Upload file to Supabase Storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { data: null, error }
  }
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// Delete file from Supabase Storage
export async function deleteFile(bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { data: null, error }
  }
}

