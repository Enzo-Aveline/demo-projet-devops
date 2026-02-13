# Check and create network
if (!(docker network ls --format '{{.Name}}' | Select-String -Pattern "^app-net$")) {
    Write-Host "Creating network app-net..."
    docker network create app-net
} else {
    Write-Host "Network app-net already exists."
}

# Check and create volume
if (!(docker volume ls --format '{{.Name}}' | Select-String -Pattern "^pgdata$")) {
    Write-Host "Creating volume pgdata..."
    docker volume create pgdata
} else {
    Write-Host "Volume pgdata already exists."
}

# Run PostgreSQL
# Using 'postgres:18' as requested, mapping internal port 5432.
# Only accessible via internal network 'app-net'.
Write-Host "Starting PostgreSQL container..."
docker run -d `
  --name postgres `
  --network app-net `
  -v pgdata:/var/lib/postgresql `
  -e POSTGRES_PASSWORD=secret `
  postgres:18

# Run Adminer
# Accessible via http://localhost:8080
Write-Host "Starting Adminer container..."
docker run -d `
  --name adminer `
  --network app-net `
  -p 8080:8080 `
  adminer

Write-Host "Stack setup complete."
Write-Host "Adminer is available at http://localhost:8080"
