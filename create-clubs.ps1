# Script para crear clubes adicionales
# Reemplaza TU_TOKEN_ADMIN_AQUI con tu token de administrador

$baseUrl = "http://localhost:4000"
$adminToken = "TU_TOKEN_ADMIN_AQUI"  # Reemplaza con tu token real

# Club 1: Club Pádel Central
Write-Host "Creando Club Pádel Central..." -ForegroundColor Green

$club1 = @{
  name        = "Club Pádel Central"
  description = "El mejor club de pádel de la CDMX"
  city        = "Ciudad de México"
  zone        = "Del Valle"
  ownerId     = "4a3aa13e-e3de-4091-819b-a798a6c00515"  # ID del usuario CLUB
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Method Post -Uri "$baseUrl/clubs/create" `
        -Headers @{ Authorization="Bearer $adminToken" } `
        -ContentType "application/json" -Body $club1
    
    Write-Host "Club 1 creado exitosamente. ID: $($response1.id)" -ForegroundColor Green
    $club1Id = $response1.id
} catch {
    Write-Host "Error creando Club 1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Club 2: Padel Sports Center
Write-Host "Creando Padel Sports Center..." -ForegroundColor Green

$club2 = @{
  name        = "Padel Sports Center"
  description = "Centro deportivo premium con las mejores instalaciones"
  city        = "Ciudad de México"
  zone        = "Polanco"
  ownerId     = "4a3aa13e-e3de-4091-819b-a798a6c00515"  # ID del usuario CLUB
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Method Post -Uri "$baseUrl/clubs/create" `
        -Headers @{ Authorization="Bearer $adminToken" } `
        -ContentType "application/json" -Body $club2
    
    Write-Host "Club 2 creado exitosamente. ID: $($response2.id)" -ForegroundColor Green
    $club2Id = $response2.id
} catch {
    Write-Host "Error creando Club 2: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Club 3: Elite Padel Club
Write-Host "Creando Elite Padel Club..." -ForegroundColor Green

$club3 = @{
  name        = "Elite Padel Club"
  description = "Club exclusivo para jugadores de alto nivel"
  city        = "Ciudad de México"
  zone        = "Santa Fe"
  ownerId     = "4a3aa13e-e3de-4091-819b-a798a6c00515"  # ID del usuario CLUB
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Method Post -Uri "$baseUrl/clubs/create" `
        -Headers @{ Authorization="Bearer $adminToken" } `
        -ContentType "application/json" -Body $club3
    
    Write-Host "Club 3 creado exitosamente. ID: $($response3.id)" -ForegroundColor Green
    $club3Id = $response3.id
} catch {
    Write-Host "Error creando Club 3: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nTodos los clubes han sido creados exitosamente!" -ForegroundColor Cyan
Write-Host "Club 1 ID: $club1Id" -ForegroundColor White
Write-Host "Club 2 ID: $club2Id" -ForegroundColor White
Write-Host "Club 3 ID: $club3Id" -ForegroundColor White

# Ahora crear canchas para cada club
Write-Host "`nCreando canchas para los clubes..." -ForegroundColor Yellow

# Canchas para Club Pádel Central
$courts1 = @(
    @{
        name = "Cancha 1"
        surface = "Sintética"
        basePrice = 50000  # $500.00 en centavos
        isActive = $true
        indoor = $false
        clubId = $club1Id
    },
    @{
        name = "Cancha 2"
        surface = "Césped"
        basePrice = 60000  # $600.00 en centavos
        isActive = $true
        indoor = $false
        clubId = $club1Id
    }
)

foreach ($court in $courts1) {
    try {
        $courtJson = $court | ConvertTo-Json
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/courts" `
            -Headers @{ Authorization="Bearer $adminToken" } `
            -ContentType "application/json" -Body $courtJson
        Write-Host "Cancha '$($court.name)' creada para Club Pádel Central" -ForegroundColor Green
    } catch {
        Write-Host "Error creando cancha '$($court.name)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Canchas para Padel Sports Center
$courts2 = @(
    @{
        name = "Cancha Premium 1"
        surface = "Cristal"
        basePrice = 80000  # $800.00 en centavos
        isActive = $true
        indoor = $true
        clubId = $club2Id
    },
    @{
        name = "Cancha Premium 2"
        surface = "Cristal"
        basePrice = 80000  # $800.00 en centavos
        isActive = $true
        indoor = $true
        clubId = $club2Id
    },
    @{
        name = "Cancha Estándar"
        surface = "Sintética"
        basePrice = 60000  # $600.00 en centavos
        isActive = $true
        indoor = $false
        clubId = $club2Id
    }
)

foreach ($court in $courts2) {
    try {
        $courtJson = $court | ConvertTo-Json
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/courts" `
            -Headers @{ Authorization="Bearer $adminToken" } `
            -ContentType "application/json" -Body $courtJson
        Write-Host "Cancha '$($court.name)' creada para Padel Sports Center" -ForegroundColor Green
    } catch {
        Write-Host "Error creando cancha '$($court.name)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Canchas para Elite Padel Club
$courts3 = @(
    @{
        name = "Cancha Elite 1"
        surface = "Cristal"
        basePrice = 100000  # $1000.00 en centavos
        isActive = $true
        indoor = $true
        clubId = $club3Id
    },
    @{
        name = "Cancha Elite 2"
        surface = "Cristal"
        basePrice = 100000  # $1000.00 en centavos
        isActive = $true
        indoor = $true
        clubId = $club3Id
    }
)

foreach ($court in $courts3) {
    try {
        $courtJson = $court | ConvertTo-Json
        $response = Invoke-RestMethod -Method Post -Uri "$baseUrl/courts" `
            -Headers @{ Authorization="Bearer $adminToken" } `
            -ContentType "application/json" -Body $courtJson
        Write-Host "Cancha '$($court.name)' creada para Elite Padel Club" -ForegroundColor Green
    } catch {
        Write-Host "Error creando cancha '$($court.name)': $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n¡Proceso completado! Todos los clubes y canchas han sido creados." -ForegroundColor Cyan
