# 🔐 Sistema de Autenticación y Autorización

## ✅ **Funcionalidades Implementadas**

### **🔒 Protección de Rutas**
- ✅ **Admin Club**: Solo usuarios con rol `CLUB` o `ADMIN`
- ✅ **Admin Global**: Solo usuarios con rol `ADMIN`
- ✅ **Redirección automática** si no tienes permisos

### **👤 Gestión de Usuarios**
- ✅ **Hook de autenticación** (`useAuth`)
- ✅ **Componente de protección** (`ProtectedRoute`)
- ✅ **Navegación condicional** según roles
- ✅ **Logout funcional**

### **🎯 Flujo de Autenticación**
1. **Usuario no autenticado**: Ve botón "Entrar"
2. **Usuario autenticado**: Ve su nombre y botón "Ir a Clubes"
3. **Usuario CLUB**: Ve botón "Admin Club"
4. **Usuario ADMIN**: Ve botones "Admin Club" y "Admin Global"
5. **Usuario USER**: No ve botones de administración

## 🚀 **Cómo Probar el Sistema**

### **1. Crear Usuarios de Prueba**
```powershell
# Ejecuta este script para crear usuarios con diferentes roles
.\create-test-users.ps1
```

### **2. Probar Diferentes Roles**

#### **👤 Usuario Normal (USER)**
- Email: `usuario@test.com`
- Contraseña: `password123`
- **Puede**: Ver clubes, hacer reservas
- **No puede**: Acceder a admin club o admin global

#### **🏢 Usuario Club (CLUB)**
- Email: `club@test.com`
- Contraseña: `password123`
- **Puede**: Ver clubes, hacer reservas, acceder a admin club
- **No puede**: Acceder a admin global

#### **👑 Usuario Admin (ADMIN)**
- Email: `admin@test.com`
- Contraseña: `password123`
- **Puede**: Acceder a todo (admin club y admin global)

### **3. Flujo de Prueba**
1. **Ve a la página principal** (`/`)
2. **Haz clic en "Entrar"**
3. **Inicia sesión** con cualquiera de los usuarios de prueba
4. **Observa** que los botones de administración aparecen según tu rol
5. **Prueba acceder** a `/club-admin` y `/admin` directamente
6. **Verifica** que te redirige si no tienes permisos

## 🔧 **Configuración Técnica**

### **Hook useAuth**
```typescript
const {
  user,           // Datos del usuario
  token,          // Token de autenticación
  isAuthenticated, // Estado de autenticación
  isLoading,      // Estado de carga
  login,          // Función de login
  logout,         // Función de logout
  hasRole,        // Verificar rol específico
  canAccessClubAdmin,    // Puede acceder a admin club
  canAccessGlobalAdmin,  // Puede acceder a admin global
} = useAuth();
```

### **Componente ProtectedRoute**
```typescript
<ProtectedRoute requiredRole="ADMIN">
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute requiredRoles={["CLUB", "ADMIN"]}>
  <ClubAdminPage />
</ProtectedRoute>
```

## 🎯 **Comportamiento por Rol**

| Rol | Página Principal | Admin Club | Admin Global | Clubes | Reservas |
|-----|-----------------|------------|---------------|--------|----------|
| **USER** | ✅ | ❌ | ❌ | ✅ | ✅ |
| **CLUB** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ |

## 🔄 **Flujo de Redirección**

1. **Usuario no autenticado** → `/auth`
2. **Login exitoso** → `/` (página principal)
3. **Sin permisos** → `/` (página principal)
4. **Logout** → `/` (página principal)

## 🛠️ **Personalización**

### **Agregar Nuevos Roles**
1. Actualiza el tipo `User` en `useAuth.ts`
2. Agrega la lógica en `canAccess*` functions
3. Actualiza `ProtectedRoute` si es necesario

### **Cambiar Redirecciones**
1. Modifica `fallbackPath` en `ProtectedRoute`
2. Actualiza `router.push()` en `useAuth.ts`

¡El sistema de autenticación está completamente funcional! 🎉
