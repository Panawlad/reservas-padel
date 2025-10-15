# Configuración de Clubes - ReservasPádel

## 📋 Instrucciones para crear clubes adicionales

### 1. Preparar el entorno

Asegúrate de que tu servidor backend esté ejecutándose en `http://localhost:4000` y que tengas un token de administrador válido.

### 2. Obtener el token de administrador

1. Inicia sesión como administrador en tu aplicación
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Application" o "Almacenamiento"
4. Busca el token en localStorage
5. Copia el token

### 3. Ejecutar el script de PowerShell

1. Abre PowerShell como administrador
2. Navega al directorio del proyecto
3. Edita el archivo `create-clubs.ps1` y reemplaza `TU_TOKEN_ADMIN_AQUI` con tu token real
4. Ejecuta el script:

```powershell
.\create-clubs.ps1
```

### 4. Clubes que se crearán

El script creará 3 clubes con sus respectivas canchas:

#### 🏢 Club Pádel Central
- **Ubicación**: Ciudad de México - Del Valle
- **Descripción**: El mejor club de pádel de la CDMX
- **Canchas**:
  - Cancha 1 (Sintética) - $500.00/hora
  - Cancha 2 (Césped) - $600.00/hora

#### 🏢 Padel Sports Center
- **Ubicación**: Ciudad de México - Polanco
- **Descripción**: Centro deportivo premium con las mejores instalaciones
- **Canchas**:
  - Cancha Premium 1 (Cristal) - $800.00/hora
  - Cancha Premium 2 (Cristal) - $800.00/hora
  - Cancha Estándar (Sintética) - $600.00/hora

#### 🏢 Elite Padel Club
- **Ubicación**: Ciudad de México - Santa Fe
- **Descripción**: Club exclusivo para jugadores de alto nivel
- **Canchas**:
  - Cancha Elite 1 (Cristal) - $1000.00/hora
  - Cancha Elite 2 (Cristal) - $1000.00/hora

### 5. Página de administración del club

Una vez creados los clubes, los propietarios pueden:

1. Ir a `/club-admin` en la aplicación
2. Personalizar la información del club
3. Gestionar las canchas (agregar, editar, activar/desactivar)
4. Configurar precios y capacidades
5. Establecer amenidades

### 6. Verificación

Después de ejecutar el script, verifica que:

1. Los clubes aparezcan en la página principal (`/home`)
2. Cada club muestre el número correcto de canchas
3. Los precios se muestren correctamente
4. La información personalizada se refleje en la interfaz

### 🔧 Solución de problemas

Si encuentras errores:

1. **Error 401**: Verifica que el token de administrador sea válido
2. **Error 500**: Asegúrate de que el servidor backend esté ejecutándose
3. **Error de conexión**: Verifica que la URL del servidor sea correcta

### 📝 Notas importantes

- Los precios se almacenan en centavos (50000 = $500.00)
- Cada cancha tiene una capacidad máxima de 4 jugadores
- Los clubes se crean con el mismo `ownerId` por defecto
- Puedes modificar el script para usar diferentes propietarios

### 🚀 Próximos pasos

1. Ejecuta el script para crear los clubes
2. Inicia sesión como propietario de club
3. Ve a la página de administración
4. Personaliza la información de tu club
5. Configura las canchas según tus necesidades
