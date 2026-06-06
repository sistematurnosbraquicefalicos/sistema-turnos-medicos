# 🔧 Guía de Configuración

Pasos para configurar completamente el sistema de turnos médicos.

## 1️⃣ CREAR GOOGLE SHEETS

### 1.1 Ejecutar Google Apps Script

Ve a **https://script.google.com/** y copia este código:

```javascript
function crearHojaTurnos() {
  const spreadsheet = SpreadsheetApp.create("Consultorio - Turnos");
  const spreadsheetId = spreadsheet.getId();
  const sheets = spreadsheet.getSheets();
  
  sheets[0].setName("Pacientes");
  const hojaPacientes = sheets[0];
  
  spreadsheet.insertSheet("Horarios");
  const hojaHorarios = spreadsheet.getSheetByName("Horarios");
  
  spreadsheet.insertSheet("Notificaciones");
  const hojaNotificaciones = spreadsheet.getSheetByName("Notificaciones");
  
  // Headers Pacientes
  const headersPacientes = [
    "ID", "Nombre", "Email", "Teléfono", "Raza", "Peso", "Edad",
    "Día", "Hora", "Médico", "Estado", "Alergias", "Medicamentos",
    "Antecedentes", "Fecha_Creación"
  ];
  
  hojaPacientes.appendRow(headersPacientes);
  const rangeHeader = hojaPacientes.getRange(1, 1, 1, headersPacientes.length);
  rangeHeader.setBackground("#2E75B6");
  rangeHeader.setFontColor("#FFFFFF");
  rangeHeader.setFontWeight("bold");
  
  // Headers Horarios
  const headersHorarios = ["Día", "Médico", "Hora_1", "Hora_2", "Hora_3", "Hora_4", "Hora_5"];
  hojaHorarios.appendRow(headersHorarios);
  hojaHorarios.appendRow(["Lunes", "Dr. García", "09:00", "10:00", "11:00", "", ""]);
  hojaHorarios.appendRow(["Martes", "Dra. López", "09:00", "10:30", "11:30", "", ""]);
  hojaHorarios.appendRow(["Miércoles", "Dr. Martínez", "14:00", "15:00", "16:00", "", ""]);
  hojaHorarios.appendRow(["Jueves", "Dra. Silva", "09:00", "10:00", "11:00", "", ""]);
  hojaHorarios.appendRow(["Viernes", "Dr. García", "10:00", "11:00", "14:00", "", ""]);
  
  const rangeHeaderHorarios = hojaHorarios.getRange(1, 1, 1, headersHorarios.length);
  rangeHeaderHorarios.setBackground("#2E75B6");
  rangeHeaderHorarios.setFontColor("#FFFFFF");
  rangeHeaderHorarios.setFontWeight("bold");
  
  // Headers Notificaciones
  const headersNotificaciones = ["ID", "Fecha_Hora", "Para", "Asunto", "Contenido", "Turno_ID", "Leído"];
  hojaNotificaciones.appendRow(headersNotificaciones);
  
  const rangeHeaderNotif = hojaNotificaciones.getRange(1, 1, 1, headersNotificaciones.length);
  rangeHeaderNotif.setBackground("#2E75B6");
  rangeHeaderNotif.setFontColor("#FFFFFF");
  rangeHeaderNotif.setFontWeight("bold");
  
  Logger.log("✅ Hoja creada: " + spreadsheetId);
  SpreadsheetApp.getUi().alert("✅ Hoja creada!\n\nID: " + spreadsheetId);
}
```

### 1.2 Ejecutar el script
1. Clica **▶ Ejecutar**
2. Autoriza cuando te pida
3. ✅ Se crea la hoja automáticamente en tu Drive

### 1.3 Anotar el ID de la hoja
Cuando termine, verás en la consola un mensaje como:
```
✅ Hoja creada: 1BxDkVQS9xZ...
```

**Guarda ese ID**, lo necesitarás después.

---

## 2️⃣ CONFIGURAR SHEETDB

### 2.1 Crear API en SheetDB

1. Ve a **https://sheetdb.io/**
2. Clica **"Create API"**
3. Conecta tu cuenta de Google
4. Selecciona la hoja **"Consultorio - Turnos"**
5. Clica **"Create"**

### 2.2 Copiar el URL de la API

Verás algo como:
```
https://sheetdb.io/api/v1/seu1qvyyzpn86
```

**Copia este URL completo**, es tu conexión a la base de datos.

---

## 3️⃣ CONFIGURAR VARIABLES DE ENTORNO

### 3.1 Crear archivo .env

En la carpeta raíz del proyecto crea un archivo llamado `.env`

### 3.2 Agregar la variable

```
REACT_APP_SHEETDB_URL=https://sheetdb.io/api/v1/seu1qvyyzpn86
```

Reemplaza `seu1qvyyzpn86` con tu ID.

---

## 4️⃣ PERSONALIZAR HORARIOS Y MÉDICOS

### 4.1 Editar en Google Sheets

1. Abre tu hoja en Google Drive
2. Ve a la pestaña **"Horarios"**
3. Cambia los días, médicos y horas según tu consultorio
4. **Guarda** (Ctrl+S)

### 4.2 La app se actualiza automáticamente

Gracias a SheetDB, la app lee los cambios en tiempo real.

---

## 5️⃣ INSTALAR Y EJECUTAR

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start
```

La app abrirá en `http://localhost:3000`

---

## ✅ VERIFICAR QUE FUNCIONA

1. **Propietario:**
   - Clica "Propietario"
   - Ve a "Configurar Semana"
   - Verifica que se cargan los horarios desde Google Sheets

2. **Paciente:**
   - Clica "Paciente"
   - Crea un turno de prueba
   - Verifica que se guarda en Google Sheets

3. **Google Sheets:**
   - Abre tu hoja en Drive
   - Ve a "Pacientes"
   - Verifica que aparece el turno nuevo

---

## 🚀 DEPLOY A VERCEL (Gratis)

### 5.1 Crear cuenta en Vercel

1. Ve a **https://vercel.com/**
2. Clica "Sign Up"
3. Conecta tu cuenta de GitHub

### 5.2 Importar proyecto

1. Clica "New Project"
2. Selecciona tu repositorio de GitHub
3. Clica "Import"
4. **Variables de entorno:** Agrega `REACT_APP_SHEETDB_URL`
5. Clica "Deploy"

### 5.3 Tu app está online

Vercel te dará una URL como:
```
https://sistema-turnos-medicos.vercel.app
```

**¡Listo! Tu app está en internet 🎉**

---

## 📝 NOTAS IMPORTANTES

- **Google Sheets es tu BD:** No pierdas el link
- **SheetDB conecta todo:** Sin él, la app no funciona
- **Variables de entorno:** Guárdalas seguras
- **Backups:** Descarga tu Google Sheets regularmente

---

## ❓ PROBLEMAS COMUNES

### "Error de conexión a SheetDB"
- Verifica que copiastel URL correcto
- Confirma que la hoja está pública o accesible

### "Los horarios no se cargan"
- Recarga la página (Ctrl+Shift+R)
- Verifica que editaste la hoja correctamente en Google Sheets

### "El turno no se guarda"
- Revisa la consola (F12) para ver errores
- Verifica que tienes internet
- Confirma el URL de SheetDB

---

¿Preguntas? Abre un Issue en GitHub.
