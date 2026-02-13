$ErrorActionPreference = "Continue"

Write-Host "Step 1: Setting up fresh stack..."
.\cleanup.ps1 -RemoveVolume $false # Ensure no conflict, but keep volume if it exists (or we can blow it away for a truly fresh test? logic below)
# Actually for a valid persistence test we assume we start from a state, create data, reset, and check.
# Let's start fresh-fresh to be sure.
Write-Host "Cleaning everything for a fresh start..."
.\cleanup.ps1 -RemoveVolume $true
.\setup.ps1

Write-Host "Waiting for Postgres to accept connections..."
Start-Sleep -Seconds 20 # Give it more time to initialize
# Retry loop could be better, but sleep is simple for now.

Write-Host "Step 2: Creating table and inserting data..."
# Create table and insert
docker exec -e PGPASSWORD=secret postgres psql -U postgres -d postgres -c "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100), email VARCHAR(100));"
docker exec -e PGPASSWORD=secret postgres psql -U postgres -d postgres -c "INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com'), ('Bob', 'bob@example.com');"

Write-Host "Verifying data insertion..."
$InitialCount = docker exec -e PGPASSWORD=secret postgres psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;"
Write-Host "Rows found: $InitialCount"

if ($InitialCount.Trim() -ne "2") {
    Write-Error "Data insertion failed!"
}

Write-Host "Step 3: Destroying containers (keeping volume)..."
.\cleanup.ps1 -RemoveVolume $false

Write-Host "Step 4: Relaunching stack..."
.\setup.ps1

Write-Host "Waiting for Postgres to restart..."
Start-Sleep -Seconds 20

Write-Host "Step 5: Verifying persistence..."
$FinalCount = docker exec -e PGPASSWORD=secret postgres psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;"
Write-Host "Rows found after restart: $FinalCount"

if ($FinalCount.Trim() -eq "2") {
    Write-Host "SUCCESS: Data survived the container restart!" -ForegroundColor Green
} else {
    Write-Error "FAILURE: Data lost or mismatch!"
}
