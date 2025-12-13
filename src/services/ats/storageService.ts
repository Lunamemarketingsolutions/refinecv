import { supabase } from '../../lib/supabase';

const STORAGE_BUCKET = 'cv-uploads';

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
}

export async function uploadResumeToStorage(
  file: File,
  userId?: string,
  fileName?: string
): Promise<UploadResult> {
  const uniqueFileName = fileName || (userId ? `${userId}/${generateUniqueFileName(file.name)}` : generateUniqueFileName(file.name));

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(uniqueFileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    fullPath: data.fullPath,
    publicUrl: urlData.publicUrl
  };
}

export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '_');

  return `${nameWithoutExt}_${timestamp}_${randomString}.${extension}`;
}

export async function deleteResumeFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

export async function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function downloadResumeFromStorage(path: string): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(path);

  if (error || !data) {
    throw new Error(`Failed to download file: ${error?.message || 'No data returned'}`);
  }

  return data;
}
