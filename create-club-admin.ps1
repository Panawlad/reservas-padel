# Script para crear un usuario administrador de club
# Reemplaza TU_TOKEN_ADMIN_AQUI con tu token de administrador

$baseUrl = "http://localhost:4000"
$adminToken = "TU_TOKEN_ADMIN_AQUI"  # Reemplaza con tu token real

Write-Host "Creando usuario administrador de club..." -ForegroundColor Green

# Datos del usuario administrador de club
$clubAdmin = @{
  email = "club@reservaspadel.com"
  password = "ClubAdmin123!"
  name = "Administrador Club"
  role = "CLUB"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/auth/register" `
        -ContentType "application/json" -Body $clubAdmin
    
    Write-Host "Usuario administrador de club creado exitosamente!" -ForegroundColor Green
    Write-Host "Email: club@reservaspadel.com" -ForegroundColor White
    Write-Host "Password: ClubAdmin123!" -ForegroundColor White
    Write-Host "Role: CLUB" -ForegroundColor White
    Write-Host "ID: $($response.user.id)" -ForegroundColor White
    
    # Guardar el ID del usuario para usar en la creación de clubes
    $clubOwnerId = $response.user.id
    Write-Host "`nGuardando ID del propietario: $clubOwnerId" -ForegroundColor Yellow
    
    # Actualizar el script de creación de clubes con el nuevo ID
    $createClubsScript = Get-Content "create-clubs.ps1" -Raw
    $updatedScript = $createClubsScript -replace "4a3aa13e-e3de-4091-819b-a798a6c00515", $clubOwnerId
    Set-Content "create-clubs-updated.ps1" $updatedScript
    
    Write-Host "`nScript actualizado guardado como 'create-clubs-updated.ps1'" -ForegroundColor Cyan
    Write-Host "Ahora puedes ejecutar ese script para crear los clubes con el nuevo propietario." -ForegroundColor Cyan
    
} catch {
    Write-Host "Error creando usuario administrador de club: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "El usuario ya existe. Puedes usar las credenciales existentes:" -ForegroundColor Yellow
        Write-Host "Email: club@reservaspadel.com" -ForegroundColor White
        Write-Host "Password: ClubAdmin123!" -ForegroundColor White
    }
    exit 1
}

Write-Host "`n¡Proceso completado!" -ForegroundColor Cyan
Write-Host "Ahora puedes:" -ForegroundColor White
Write-Host "1. Iniciar sesión con las credenciales del administrador de club" -ForegroundColor White
Write-Host "2. Ir a /club-admin para personalizar tu club" -ForegroundColor White
Write-Host "3. Ejecutar create-clubs-updated.ps1 para crear clubes de ejemplo" -ForegroundColor White
