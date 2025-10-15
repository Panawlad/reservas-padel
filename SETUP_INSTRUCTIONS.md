# 🚀 Guía Completa de Configuración - ReservasPádel

## 📋 Pasos para Configurar el Sistema

### 1. **Arreglar los Errores Actuales**

Los errores que estás viendo son:
- **Error de hidratación**: Ya arreglado envolviendo `WalletMultiButton` en un div
- **Error de red**: El servidor backend no está ejecutándose

### 2. **Iniciar el Servidor Backend**

```bash
# En la carpeta raíz del proyecto
npm run dev
# o
node src/server.ts
```

### 3. **Crear Usuario Administrador de Club**

#### Opción A: Usar el script automático
```powershell
# 1. Edita create-club-admin.ps1 y reemplaza TU_TOKEN_ADMIN_AQUI con tu token
# 2. Ejecuta el script
.\create-club-admin.ps1
```

#### Opción B: Crear manualmente
1. Ve a `http://localhost:4000/auth/register`
2. Registra un usuario con:
   - **Email**: `club@reservaspadel.com`
   - **Password**: `ClubAdmin123!`
   - **Name**: `Administrador Club`
   - **Role**: `CLUB`

### 4. **Obtener Token de Administrador**

```powershell
# Ejecuta este script para obtener tu token
.\get-user-token.ps1
```

### 5. **Crear Clubes de Ejemplo**

```powershell
# 1. Edita create-clubs.ps1 y reemplaza TU_TOKEN_ADMIN_AQUI con tu token
# 2. Ejecuta el script
.\create-clubs.ps1
```

### 6. **Personalizar tu Club**

1. **Inicia sesión** con las credenciales del administrador de club:
   - Email: `club@reservaspadel.com`
   - Password: `ClubAdmin123!`

2. **Ve a la página de administración**:
   - URL: `http://localhost:3000/club-admin`

3. **Personaliza tu club**:
   - Cambia el nombre, descripción, ciudad, zona
   - Agrega o edita canchas
   - Configura precios y capacidades
   - Activa/desactiva canchas

### 7. **Verificar que Todo Funcione**

1. **Página principal**: `http://localhost:3000`
   - Debe mostrar el gradiente de colores
   - Navegación glassmorphism
   - Sin errores de hidratación

2. **Página de clubes**: `http://localhost:3000/home`
   - Debe mostrar los clubes creados
   - Información personalizada visible
   - Mismo estilo glassmorphism

3. **Página de reservas**: `http://localhost:3000/reservations`
   - Mismo estilo que la página principal
   - Sin errores de red

4. **Página de administración**: `http://localhost:3000/club-admin`
   - Debe cargar la información del club
   - Formularios funcionales
   - Modales para edición

## 🔧 Solución de Problemas

### Error de Hidratación
- ✅ **Solucionado**: Envolviendo `WalletMultiButton` en un div wrapper

### Error de Red (Network Error)
- **Causa**: El servidor backend no está ejecutándose
- **Solución**: Ejecutar `npm run dev` en la carpeta raíz

### Error 401 (Unauthorized)
- **Causa**: Token inválido o expirado
- **Solución**: Obtener un nuevo token con `get-user-token.ps1`

### Error 404 (Not Found)
- **Causa**: Endpoint no existe
- **Solución**: Verificar que el servidor backend esté ejecutándose

## 📱 Flujo de Usuario Completo

### Para Administradores de Club:
1. **Registrarse** → `http://localhost:3000/auth`
2. **Administrar club** → `http://localhost:3000/club-admin`
3. **Personalizar información** → Formularios en la página de admin
4. **Gestionar canchas** → Agregar/editar canchas
5. **Ver resultados** → `http://localhost:3000/home`

### Para Usuarios Regulares:
1. **Ver clubes disponibles** → `http://localhost:3000/home`
2. **Seleccionar cancha** → Hacer clic en "Ver horarios"
3. **Reservar** → Seleccionar horario disponible
4. **Ver reservas** → `http://localhost:3000/reservations`

## 🎨 Características del Diseño

- **Fondo gradiente** vibrante en todas las páginas
- **Efecto glassmorphism** en todos los elementos
- **Texto blanco** para máximo contraste
- **Navegación transparente** con efectos de blur
- **Responsive design** para móviles y desktop
- **Animaciones suaves** y transiciones

## 📊 Estructura de Datos

### Clubes Creados:
- **Club Pádel Central** (Del Valle) - 2 canchas
- **Padel Sports Center** (Polanco) - 3 canchas  
- **Elite Padel Club** (Santa Fe) - 2 canchas

### Tipos de Superficie:
- Sintética ($500-600/hora)
- Césped ($600/hora)
- Cristal ($800-1000/hora)

### Capacidades:
- Todas las canchas: 4 jugadores máximo
- Amenidades: Iluminación LED, Vestuarios, Parking gratuito

## 🚀 Próximos Pasos

1. **Ejecutar los scripts** para crear usuarios y clubes
2. **Personalizar la información** en la página de administración
3. **Probar el flujo completo** de reservas
4. **Ajustar precios y horarios** según necesidades
5. **Agregar más clubes** si es necesario

¡El sistema está listo para usar! 🎉
