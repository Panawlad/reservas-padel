import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar definidos en las variables de entorno.');
}

// Cliente de Supabase para operaciones del servidor (con service key)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para subir imagen a Supabase Storage
export const uploadImageToSupabase = async (
  bucket: string,
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
) => {
  console.log("Intentando subir a Supabase:", { bucket, filePath, contentType });
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error("Error de Supabase Storage:", error);
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }

  console.log("Upload exitoso, obteniendo URL pública...");

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    console.error("No se pudo obtener URL pública");
    throw new Error('Error obteniendo URL pública de la imagen');
  }

  console.log("URL pública obtenida:", publicUrlData.publicUrl);
  return publicUrlData.publicUrl;
};
