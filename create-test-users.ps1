# Script para crear usuarios de prueba con diferentes roles

# Configuración
$API_URL = "http://localhost:4000"
$ADMIN_TOKEN = "TU_TOKEN_ADMIN_AQUI"  # Reemplaza con tu token de admin

Write-Host "🚀 Creando usuarios de prueba..." -ForegroundColor Green

# 1. Crear usuario normal (USER)
Write-Host "👤 Creando usuario normal..." -ForegroundColor Yellow
$userData = @{
    email = "usuario@test.com"
    password = "password123"
    role = "USER"
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Method Post -Uri "$API_URL/auth/signup" -ContentType "application/json" -Body $userData
    Write-Host "✅ Usuario creado: $($userResponse.user.email)" -ForegroundColor Green
    Write-Host "   Token: $($userResponse.token)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando usuario: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Crear usuario club (CLUB)
Write-Host "🏢 Creando usuario club..." -ForegroundColor Yellow
$clubUserData = @{
    email = "club@test.com"
    password = "password123"
    role = "CLUB"
} | ConvertTo-Json

try {
    $clubUserResponse = Invoke-RestMethod -Method Post -Uri "$API_URL/auth/signup" -ContentType "application/json" -Body $clubUserData
    Write-Host "✅ Usuario club creado: $($clubUserResponse.user.email)" -ForegroundColor Green
    Write-Host "   Token: $($clubUserResponse.token)" -ForegroundColor Cyan
    
    # Crear club para este usuario
    $clubData = @{
        name = "Club de Prueba"
        description = "Club de prueba para testing"
        city = "Ciudad de México"
        zone = "Del Valle"
        ownerId = $clubUserResponse.user.id
    } | ConvertTo-Json
    
    $clubResponse = Invoke-RestMethod -Method Post -Uri "$API_URL/clubs/create" -Headers @{ Authorization="Bearer $ADMIN_TOKEN" } -ContentType "application/json" -Body $clubData
    Write-Host "✅ Club creado: $($clubResponse.name)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error creando usuario club: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Crear usuario admin (ADMIN)
Write-Host "👑 Creando usuario admin..." -ForegroundColor Yellow
$adminData = @{
    email = "admin@test.com"
    password = "password123"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Method Post -Uri "$API_URL/auth/signup" -ContentType "application/json" -Body $adminData
    Write-Host "✅ Usuario admin creado: $($adminResponse.user.email)" -ForegroundColor Green
    Write-Host "   Token: $($adminResponse.token)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creando usuario admin: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Usuarios de prueba creados!" -ForegroundColor Green
Write-Host "`n📋 Resumen de usuarios:" -ForegroundColor Cyan
Write-Host "👤 Usuario normal: usuario@test.com" -ForegroundColor White
Write-Host "🏢 Usuario club: club@test.com" -ForegroundColor White
Write-Host "👑 Usuario admin: admin@test.com" -ForegroundColor White
Write-Host "`n🔑 Todos usan la contraseña: password123" -ForegroundColor Yellow
