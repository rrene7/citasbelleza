# Siguiente nivel - Citas Belleza Panama

Este documento organiza las cuatro mejoras solicitadas para el sistema.

## 1. Login de salones

Objetivo: permitir que cada salon entre con su cuenta y gestione solo su informacion.

Backend requerido:
- `api/auth/login.php`
- `api/auth/logout.php`
- `api/auth/me.php`
- Uso de sesiones PHP.

Frontend requerido:
- Pantalla `/login`
- Guardar sesion de salon/admin
- Proteger `/admin`

## 2. Panel admin real

Objetivo: reemplazar datos simulados por datos reales de MariaDB.

Modulos:
- Dashboard de resumen
- Gestion de citas
- Gestion de salones
- Gestion de servicios
- Gestion de trabajadores
- Cambiar estado de cita: pendiente, confirmada, completada, cancelada

## 3. Agenda visual

Objetivo: mostrar citas por fecha y horario.

Funciones:
- Filtro por fecha
- Filtro por salon/trabajador
- Vista tipo lista por horas
- Colores por estado

## 4. Notificaciones WhatsApp

Objetivo: generar mensaje automatico al crear o confirmar una cita.

Fase inicial:
- Link wa.me con mensaje prellenado.
- Boton para enviar confirmacion por WhatsApp.

Fase avanzada:
- Integracion con proveedor externo de WhatsApp Business API.

## Orden recomendado

1. Login
2. Panel admin conectado a API
3. Agenda visual
4. WhatsApp automatico
