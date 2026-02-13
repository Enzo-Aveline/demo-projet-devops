param (
    [switch]$RemoveVolume = $false
)

Write-Host "Stopping containers..."
docker stop postgres adminer 2>$null
Write-Host "Removing containers..."
docker rm postgres adminer 2>$null

# Optionally remove volume for a full clean slate (not used in persistence test)
if ($RemoveVolume) {
    Write-Host "Removing volume pgdata..."
    docker volume rm pgdata 2>$null
}

Write-Host "Cleanup complete."

