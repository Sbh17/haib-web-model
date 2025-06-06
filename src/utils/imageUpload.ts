
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxqdslpzqcavzchpsrrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4cWRzbHB6cWNhdnpjaHBzcnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDMyNDksImV4cCI6MjA2MjYxOTI0OX0.39qm9lMU8SROxAD2zQbGTZP11WDBtXjuIqkOMC1zTeE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (
  file: File,
  bucket: string,
  folder: string,
  fileName?: string
): Promise<UploadResult> => {
  const fileExt = file.name.split('.').pop();
  const finalFileName = fileName || `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${finalFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath
  };
};

export const deleteImage = async (bucket: string, path: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
