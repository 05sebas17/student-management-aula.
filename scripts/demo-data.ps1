param([string]$BaseUrl = 'http://localhost:8080')
$ErrorActionPreference = 'Stop'
# Datos ficticios opcionales para la demostración; no elimina registros existentes.
$students = @(
    @{ firstName = 'Camila'; lastName = 'Álvarez'; email = 'camila.alvarez@example.com' },
    @{ firstName = 'Daniel'; lastName = 'Castro'; email = 'daniel.castro@example.com' },
    @{ firstName = 'Valentina'; lastName = 'Morales'; email = 'valentina.morales@example.com' },
    @{ firstName = 'Santiago'; lastName = 'Rojas'; email = 'santiago.rojas@example.com' }
)
foreach ($student in $students) {
    try {
        $json = $student | ConvertTo-Json
        $bytes = [Text.Encoding]::UTF8.GetBytes($json)
        $result = Invoke-RestMethod -Uri "$BaseUrl/students" -Method Post -ContentType 'application/json; charset=utf-8' -Body $bytes
        Write-Host "Registrado: $($result.firstName) $($result.lastName)"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            Write-Host "Ya registrado: $($student.email)"
        } else { throw }
    }
}
