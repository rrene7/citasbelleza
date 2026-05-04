# Prueba API de citas

## 1. Actualizar proyecto local

```powershell
cd C:\xampp\htdocs\citasbelleza
git pull
```

## 2. Ver citas

Abrir en navegador:

```txt
http://localhost/citasbelleza/api/citas/
```

Si devuelve `[]`, significa que la API funciona y no hay citas creadas todavia.

## 3. Crear cita desde PowerShell

```powershell
$body = @{
  cliente_nombre = "Roberto Frias"
  cliente_email = "roberto@test.com"
  cliente_telefono = "6000-1234"
  salon_id = 1
  trabajador_id = 1
  servicio_id = 1
  fecha = "2026-05-05"
  hora = "10:00"
  notas = "Prueba desde PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost/citasbelleza/api/citas/store.php" -Method POST -ContentType "application/json" -Body $body
```

Respuesta esperada:

```json
{"ok":true}
```

## 4. Verificar de nuevo

```txt
http://localhost/citasbelleza/api/citas/
```

Ahora debe aparecer la cita creada.

## 5. Consultar disponibilidad

```txt
http://localhost/citasbelleza/api/citas/disponibilidad.php?trabajador_id=1&fecha=2026-05-05
```

La hora ocupada ya no debe aparecer disponible.
