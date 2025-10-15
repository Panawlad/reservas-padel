# 📸 Configuración de Imágenes - ReservasPádel

## 🗄️ **Schema de Base de Datos Actualizado**

He actualizado el schema de Prisma para incluir soporte completo de imágenes:

### **Nuevos Modelos:**

#### **ClubImage** - Imágenes de Clubes
```prisma
model ClubImage {
  id          String    @id @default(uuid())
  url         String    // URL de la imagen en Supabase Storage
  alt         String?   // Texto alternativo para accesibilidad
  isPrimary   Boolean   @default(false) // Imagen principal del club
  orderIndex  Int       @default(0) // Orden de visualización
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  club        Club      @relation(fields: [clubId], references: [id], onDelete: Cascade)
  clubId      String

  @@index([clubId])
  @@index([clubId, isPrimary])
}
```

#### **CourtImage** - Imágenes de Canchas
```prisma
model CourtImage {
  id          String    @id @default(uuid())
  url         String    // URL de la imagen en Supabase Storage
  alt         String?   // Texto alternativo para accesibilidad
  isPrimary   Boolean   @default(false) // Imagen principal de la cancha
  orderIndex  Int       @default(0) // Orden de visualización
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  court       Court     @relation(fields: [courtId], references: [id], onDelete: Cascade)
  courtId     String

  @@index([courtId])
  @@index([courtId, isPrimary])
}
```

## 🚀 **Pasos para Aplicar la Migración**

### **1. Ejecutar Migración en Supabase**

1. **Ve a tu proyecto de Supabase**
2. **Abre el SQL Editor**
3. **Copia y pega** el contenido de `migrate-images.sql`
4. **Ejecuta** el script

### **2. Regenerar el Cliente de Prisma**

```bash
# En la carpeta raíz del proyecto
npx prisma generate
```

### **3. Verificar la Conexión**

```bash
# Verificar que la base de datos esté sincronizada
npx prisma db pull
```

## 📊 **Estructura de Datos**

### **Relaciones:**
- ✅ **Club** → **ClubImage** (1:N)
- ✅ **Court** → **CourtImage** (1:N)
- ✅ **Cascade Delete** - Al eliminar club/cancha se eliminan sus imágenes

### **Campos:**
- ✅ **url**: URL de la imagen en Supabase Storage
- ✅ **alt**: Texto alternativo para accesibilidad
- ✅ **isPrimary**: Marca la imagen principal
- ✅ **orderIndex**: Orden de visualización en sliders

### **Índices:**
- ✅ **clubId**: Para consultas rápidas por club
- ✅ **courtId**: Para consultas rápidas por cancha
- ✅ **isPrimary**: Para encontrar imagen principal rápidamente

## 🎯 **Funcionalidades Implementadas**

### **Backend:**
- ✅ **Endpoints actualizados** para incluir imágenes
- ✅ **Relaciones** configuradas en Prisma
- ✅ **Índices** para optimizar consultas
- ✅ **RLS** (Row Level Security) habilitado

### **Frontend (Próximos pasos):**
- 🔄 **Slider de imágenes** en página principal
- 🔄 **Galería de canchas** en página del club
- 🔄 **Subida de imágenes** en administración
- 🔄 **Gestión de imágenes** (agregar, eliminar, reordenar)

## 📁 **Almacenamiento de Imágenes**

### **Supabase Storage:**
- **Bucket recomendado**: `club-images`
- **Estructura de carpetas**:
  ```
  club-images/
  ├── clubs/
  │   └── {clubId}/
  │       ├── primary.jpg
  │       ├── gallery-1.jpg
  │       └── gallery-2.jpg
  └── courts/
      └── {courtId}/
          ├── primary.jpg
          ├── view-1.jpg
          └── view-2.jpg
  ```

## 🔧 **Próximos Pasos**

1. **Ejecutar la migración** en Supabase
2. **Regenerar Prisma** con `npx prisma generate`
3. **Implementar subida** de imágenes en el frontend
4. **Crear sliders** de imágenes
5. **Agregar gestión** de imágenes en administración

## 📝 **Ejemplo de Uso**

```typescript
// Obtener club con imágenes
const club = await prisma.club.findUnique({
  where: { id: clubId },
  include: {
    images: {
      orderBy: { orderIndex: 'asc' }
    },
    courts: {
      include: {
        images: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    }
  }
});

// Imagen principal del club
const primaryImage = club.images.find(img => img.isPrimary);

// Todas las imágenes del club ordenadas
const galleryImages = club.images.sort((a, b) => a.orderIndex - b.orderIndex);
```

¡El sistema de imágenes está listo para implementar! 🎉
