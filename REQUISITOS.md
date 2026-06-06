# 📋 Especificaciones Técnicas

Requisitos funcionales y técnicos del Sistema de Turnos Médicos.

## 👥 USUARIOS

### 1. Paciente
- **Acceso:** Link público
- **Autenticación:** Por email (sin login)
- **Acciones:**
  - Ver horarios disponibles
  - Seleccionar día y hora
  - Ingresar datos personales (nombre, email, teléfono, raza, peso, edad)
  - Completar planilla (alergias, medicamentos, antecedentes)
  - Ver sus turnos
  - Cancelar turno

### 2. Médico
- **Acceso:** Notificación por email
- **Autenticación:** Sin login (solo notificaciones)
- **Acciones:**
  - Recibir email cuando se asigna turno
  - Ver datos del paciente en la planilla
  - Prepararse para la consulta

### 3. Propietario/Administrador
- **Acceso:** Panel privado (login futuro)
- **Autenticación:** Con password (futuro)
- **Acciones:**
  - Configurar horarios semanales
  - Asignar médicos a cada día
  - Ver dashboard con estadísticas
  - Ver lista de todos los turnos
  - Confirmar/Rechazar turnos (desde email 24hs antes)
  - Gestionar pacientes

---

## 📋 DATOS DEL PACIENTE

### Información Básica (Obligatoria)
- Nombre completo
- Email
- Teléfono
- Raza
- Peso (kg)
- Edad

### Planilla Médica (Obligatoria)
- Alergias conocidas
- Medicamentos actuales
- Antecedentes médicos

---

## 🔄 FLUJO DE TURNOS

```
1. SOLICITUD (Paciente)
   ├─ Ingresa datos básicos
   ├─ Elige día y hora (de disponibles)
   ├─ Sistema asigna médico automáticamente
   └─ Turno creado con estado "PENDIENTE"

2. PLANILLA (Paciente)
   ├─ Completa planilla médica
   └─ Datos guardados

3. NOTIFICACIÓN AL MÉDICO
   ├─ Email inmediato al médico
   └─ Datos del paciente incluidos

4. CONFIRMACIÓN (Propietario - 24hs antes)
   ├─ Recibe email con botones
   ├─ ✅ CONFIRMAR → Estado = CONFIRMADO
   └─ ❌ RECHAZAR → Estado = RECHAZADO

5. CONSULTA
   ├─ Paciente acude (si confirmado)
   └─ Médico atiende
```

---

## 🏥 HORARIOS Y MÉDICOS

### Configuración Semanal
```
Día         Médico            Horas Disponibles
─────────────────────────────────────────────
Lunes       Dr. García        09:00 10:00 11:00
Martes      Dra. López        09:00 10:30 11:30
Miércoles   Dr. Martínez      14:00 15:00 16:00
Jueves      Dra. Silva        09:00 10:00 11:00
Viernes     Dr. García        10:00 11:00 14:00
```

### Personalización
- Cambiar médico por día ✅
- Agregar/quitar horas ✅
- Cambiar días de atención ✅
- Editable desde el panel

---

## 📊 ESTADOS DE TURNO

| Estado | Descripción | Próxima Acción |
|--------|-------------|---|
| **PENDIENTE** | Creado, esperando confirmación | Propietario confirma/rechaza |
| **CONFIRMADO** | Aprobado por propietario | Paciente asiste |
| **RECHAZADO** | Rechazado por propietario | Paciente puede reservar otro |
| **CANCELADO** | Cancelado por paciente | Sistema libera ese horario |
| **COMPLETADO** | Consulta realizada | Archivado |

---

## 📧 NOTIFICACIONES

### Email 1: Al Médico (Inmediato)
```
Asunto: 🔔 Nuevo paciente asignado
Destinatario: [Email del médico]
Contenido:
  - Nombre del paciente
  - Email y teléfono
  - Día y hora de la cita
  - Raza, peso, edad
```

### Email 2: Al Propietario (24hs antes)
```
Asunto: ⏰ Confirmar consulta (24hs antes)
Destinatario: propietario@consultorio.com
Contenido:
  - Nombre del paciente
  - Médico asignado
  - Día y hora
  - [✅ CONFIRMAR] [❌ RECHAZAR]
```

### Email 3: Confirmación al Paciente (Futuro)
```
Asunto: ✅ Turno confirmado
Destinatario: [Email del paciente]
Contenido:
  - Confirmación de la cita
  - Día, hora, médico
  - Datos para llegar
```

---

## 🗄️ ESTRUCTURA BASE DE DATOS

### Google Sheets - Hoja "Pacientes"

| Campo | Tipo | Descripción |
|-------|------|-------------|
| ID | Número | ID único del turno |
| Nombre | Texto | Nombre completo |
| Email | Email | Email del paciente |
| Teléfono | Texto | Número de teléfono |
| Raza | Texto | Raza/Etnia |
| Peso | Número | Peso en kg |
| Edad | Número | Edad en años |
| Día | Texto | Día de la semana |
| Hora | Hora | Hora del turno |
| Médico | Texto | Nombre del médico |
| Estado | Texto | Pendiente/Confirmado/Rechazado/Cancelado |
| Alergias | Texto | Alergias (largo) |
| Medicamentos | Texto | Medicamentos actuales (largo) |
| Antecedentes | Texto | Antecedentes médicos (largo) |
| Fecha_Creación | Fecha | Cuándo se creó |

### Google Sheets - Hoja "Horarios"

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Día | Texto | Día de la semana |
| Médico | Texto | Nombre del médico |
| Hora_1 a Hora_5 | Hora | Horas disponibles |

### Google Sheets - Hoja "Notificaciones"

| Campo | Tipo | Descripción |
|-------|------|-------------|
| ID | Número | ID de notificación |
| Fecha_Hora | DateTime | Cuándo se envió |
| Para | Texto | Destinatario |
| Asunto | Texto | Asunto del email |
| Contenido | Texto | Cuerpo del email |
| Turno_ID | Número | ID del turno relacionado |
| Leído | Boolean | Si fue leído |

---

## 🔐 SEGURIDAD

### Versión 1 (Actual)
- ❌ Sin autenticación fuerte
- ✅ Datos en Google Sheets (encriptados en tránsito)
- ✅ Sin acceso directo a la BD

### Versión 2 (Futuro)
- Login con contraseña para propietario
- Autenticación de dos factores (2FA)
- Encriptación de datos sensibles
- HTTPS obligatorio
- Rate limiting en API

---

## ⚡ PERFORMANCE

### Objetivos
- ✅ Carga inicial < 2 segundos
- ✅ Sincronización SheetDB < 1 segundo
- ✅ Soporta 5-10 turnos/semana inicialmente
- ✅ Escalable a 100+ turnos/semana

### Optimizaciones
- Caching local de horarios
- Lazy loading de componentes
- Minificación en producción
- CDN en Vercel

---

## 🌐 COMPATIBILIDAD

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (320x568+)

---

## 📈 MÉTRICAS

### Monitoreo Deseado (Futuro)
- Usuarios activos
- Turnos completados
- Tasa de confirmación
- Tiempo de respuesta de API
- Errores y excepciones

---

## 🎯 ROADMAP DE VERSIONES

### v2.0 (Actual)
- ✅ Reserva básica de turnos
- ✅ Panel de propietario
- ✅ Google Sheets como BD
- ✅ Notificaciones simuladas

### v2.1
- 📧 Emails reales (SendGrid/Gmail API)
- 📱 Responsive design mejorado
- 🔐 Autenticación básica

### v2.2
- 📞 SMS de recordatorio
- 🗓️ Calendario visual
- 💳 Sistema de pago

### v3.0
- 📱 App móvil (React Native)
- 📊 Dashboard avanzado
- 🤖 IA para sugerir horarios

---

## 📞 SOPORTE TÉCNICO

¿Dudas sobre especificaciones? 

Abre un Issue en GitHub con la etiqueta `question`.
