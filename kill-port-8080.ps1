# Kill process on port 8080
$port = 8080
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Write-Host "Killing process $process on port $port"
    Stop-Process -Id $process -Force
    Write-Host "Process killed successfully"
} else {
    Write-Host "No process found on port $port"
}
