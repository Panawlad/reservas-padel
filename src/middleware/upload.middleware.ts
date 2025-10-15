import multer from 'multer';

// Configurar multer para almacenar archivos en memoria como Buffer
const storage = multer.memoryStorage();

// Crear la instancia de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo de 5MB
  },
  fileFilter: (req, file, cb) => {
    // Permitir solo archivos de imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
