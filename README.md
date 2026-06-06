# 🏥 Sistema de Turnos Médicos Online

Sistema web para gestión de reserva de turnos médicos. Permite que pacientes reserven turnos online, reciban confirmación y completen planilla médica.

## ✨ Características

- 📅 **Reserva de turnos** - Pacientes eligen día y hora disponibles
- 👨‍⚕️ **Múltiples médicos** - Asignación automática por día
- 📧 **Notificaciones por email** - Al médico y propietario
- 📋 **Planilla médica** - Datos de alergias, medicamentos, antecedentes
- 🛠️ **Panel de gestión** - Propietario configura horarios semanales
- ✅ **Confirmación manual** - Propietario confirma/rechaza 24hs antes
- 📊 **Base de datos** - Google Sheets con SheetDB

## 🎯 Flujo del Sistema

```
PACIENTE                MÉDICO              PROPIETARIO
   ↓                      ↓                      ↓
Solicita turno      Email notificación    Email 24hs antes
(elige día/hora)         ↓                      ↓
   ↓                  Conoce del turno    ✅ Confirmar
Completa planilla                        ❌ Rechazar
   ↓
Turno guardado
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 14+ (para desarrollo local)
- Cuenta de Google (para Google Sheets y SheetDB)
- Navegador moderno

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/sistema-turnos-medicos.git
cd sistema-turnos-medicos
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Google Sheets**
   - Ejecutar el Google Apps Script en `scripts/crearHojaTurnos.js`
   - Obtener el ID de la hoja
   - Crear API en SheetDB (https://sheetdb.io/)

4. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tu URL de SheetDB
```

5. **Ejecutar en desarrollo**
```bash
npm start
```

La app abrirá en `http://localhost:3000`

## 📊 Estructura de Datos

### Google Sheets - Hoja "Pacientes"
```
ID | Nombre | Email | Teléfono | Raza | Peso | Edad | 
Día | Hora | Médico | Estado | Alergias | Medicamentos | 
Antecedentes | Fecha_Creación
```

### Google Sheets - Hoja "Horarios"
```
Día | Médico | Hora_1 | Hora_2 | Hora_3 | Hora_4 | Hora_5
```

### Google Sheets - Hoja "Notificaciones"
```
ID | Fecha_Hora | Para | Asunto | Contenido | Turno_ID | Leído
```

## 🔧 Configuración

Ver [CONFIGURACION.md](docs/CONFIGURACION.md) para:
- Configurar Google Sheets
- Conectar SheetDB
- Variables de entorno
- Personalizar horarios y médicos

## 📱 Uso

### Para Pacientes
1. Acceder al link público de la app
2. Ingresar datos básicos (nombre, email, teléfono, raza, peso, edad)
3. Elegir día y hora disponibles
4. Completar planilla médica (alergias, medicamentos, antecedentes)
5. Confirmar reserva

### Para Propietario
1. Acceder con login de propietario
2. **Panel de Gestión:**
   - Configurar horarios y médicos por día
   - Ver dashboard con estadísticas
   - Gestionar turnos
3. **Emails (cada 24hs antes del turno):**
   - Confirmar o rechazar consultas
   - Botones directos en el email

### Para Médico
1. Recibe email cuando se asigna nuevo paciente
2. Conoce datos del paciente de la planilla
3. Se prepara para la consulta

## 🛠️ Tecnologías

- **Frontend:** React.js
- **Base de Datos:** Google Sheets + SheetDB
- **Notificaciones:** Simuladas (versión 1)
- **Deployment:** Vercel o Netlify (gratis)
- **Control de versiones:** Git + GitHub

## 📈 Roadmap (Próximas versiones)

- [ ] Envío de emails reales (Gmail API / SendGrid)
- [ ] SMS de recordatorio
- [ ] Dashboard médico mejorado
- [ ] Historial médico del paciente
- [ ] Reportes y analytics
- [ ] App móvil (React Native)
- [ ] Calendario visual
- [ ] Sistema de pago online
- [ ] Autenticación mejorada

## 🤝 Contribuir

Si quieres mejorar el proyecto:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -m 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto. Úsalo libremente.

## 📞 Soporte

¿Problemas? Abre un [Issue](https://github.com/tuusuario/sistema-turnos-medicos/issues)

## 👨‍💻 Autor

Sistema desarrollado con ❤️ para clínicas y consultorios médicos.

---

**Estado del proyecto:** En desarrollo (v2.0)
**Última actualización:** Junio 2026
