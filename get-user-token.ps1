# Script para obtener el token de un usuario
# Útil para obtener tokens de administrador o club

$baseUrl = "http://localhost:4000"

Write-Host "=== OBTENER TOKEN DE USUARIO ===" -ForegroundColor Cyan
Write-Host ""

# Función para hacer login y obtener token
function Get-UserToken {
    param(
        [string]$email,
        [string]$password,
        [string]$userType
    )
    
    $loginData = @{
        email = $email
        password = $password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/login" `
            -ContentType "application/json" -Body $loginData
        
        Write-Host "✅ Login exitoso para $userType" -ForegroundColor Green
        Write-Host "Email: $email" -ForegroundColor White
        Write-Host "Token: $($response.token)" -ForegroundColor Yellow
        Write-Host "Role: $($response.user.role)" -ForegroundColor White
        Write-Host "ID: $($response.user.id)" -ForegroundColor White
        Write-Host ""
        
        return $response.token
    } catch {
        Write-Host "❌ Error en login para $userType : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Opciones de usuarios predefinidos
Write-Host "Selecciona el tipo de usuario:" -ForegroundColor White
Write-Host "1. Administrador del sistema" -ForegroundColor White
Write-Host "2. Administrador de club" -ForegroundColor White
Write-Host "3. Usuario personalizado" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Ingresa tu opción (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Obteniendo token de administrador del sistema..." -ForegroundColor Green
        $token = Get-UserToken -email "admin@reservaspadel.com" -password "Admin123!" -userType "Administrador del Sistema"
    }
    "2" {
        Write-Host "Obteniendo token de administrador de club..." -ForegroundColor Green
        $token = Get-UserToken -email "club@reservaspadel.com" -password "ClubAdmin123!" -userType "Administrador de Club"
    }
    "3" {
        $email = Read-Host "Ingresa el email"
        $password = Read-Host "Ingresa la contraseña" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        $token = Get-UserToken -email $email -password $passwordPlain -userType "Usuario Personalizado"
    }
    default {
        Write-Host "Opción inválida" -ForegroundColor Red
        exit 1
    }
}

if ($token) {
    Write-Host "=== INSTRUCCIONES ===" -ForegroundColor Cyan
    Write-Host "1. Copia el token de arriba" -ForegroundColor White
    Write-Host "2. Edita el archivo create-clubs.ps1" -ForegroundColor White
    Write-Host "3. Reemplaza 'TU_TOKEN_ADMIN_AQUI' con tu token" -ForegroundColor White
    Write-Host "4. Ejecuta create-clubs.ps1 para crear los clubes" -ForegroundColor White
    Write-Host ""
    Write-Host "Token para copiar:" -ForegroundColor Yellow
    Write-Host $token -ForegroundColor Yellow
} else {
    Write-Host "No se pudo obtener el token. Verifica las credenciales." -ForegroundColor Red
}
