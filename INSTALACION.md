# 📦 Guía de Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

## ✅ REQUISITOS PREVIOS

- **Node.js 14+** - [Descargar](https://nodejs.org/)
- **Git** - [Descargar](https://git-scm.com/)
- **Cuenta de Google** - [Crear](https://accounts.google.com/)
- **Editor de código** - VSCode recomendado ([Descargar](https://code.visualstudio.com/))

### Verificar instalaciones

```bash
# Verificar Node.js y npm
node --version
npm --version

# Verificar Git
git --version
```

---

## 🚀 PASOS DE INSTALACIÓN

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/sistema-turnos-medicos.git
cd sistema-turnos-medicos
```

### 2. Instalar dependencias

```bash
npm install
```

Esto descarga todas las librerías necesarias. Toma 2-5 minutos.

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu URL de SheetDB:

```
REACT_APP_SHEETDB_URL=https://sheetdb.io/api/v1/seu1qvyyzpn86
```

### 4. Ejecutar en desarrollo

```bash
npm start
```

La app abrirá automáticamente en `http://localhost:3000`

---

## 🔗 CONFIGURACIÓN INICIAL

**Antes de usar la app, necesitas:**

1. **Google Sheets** - [Ver CONFIGURACION.md](CONFIGURACION.md)
2. **SheetDB API** - [Ver CONFIGURACION.md](CONFIGURACION.md)
3. **Variables de entorno** - Ya lo hiciste arriba ✅

---

## 🧪 PROBAR LA APP

### Test 1: Crear un turno

1. Clica "Paciente"
2. Llena el formulario
3. Elige día y hora
4. Completa planilla
5. ✅ Debe aparecer en Google Sheets

### Test 2: Panel de propietario

1. Clica "Propietario"
2. Ve a "Dashboard"
3. Debe mostrar 1 turno en "Pendientes"

### Test 3: Google Sheets

1. Abre tu hoja en Google Drive
2. Ve a "Pacientes"
3. ✅ Debe estar el turno que creaste

---

## 📱 ESTRUCTURA DEL PROYECTO

```
sistema-turnos-medicos/
├── src/
│   ├── App.jsx              ← Componente principal
│   ├── index.js
│   └── styles/
│       └── main.css
├── public/
│   └── index.html
├── docs/
│   ├── CONFIGURACION.md
│   ├── INSTALACION.md
│   └── REQUISITOS.md
├── README.md
├── package.json
├── .env                     ← Crear con tus datos
└── .gitignore
```

---

## 🐛 SOLUCIONAR PROBLEMAS

### "npm: comando no encontrado"
- Node.js no está instalado
- Descarga desde https://nodejs.org/
- Reinicia la terminal después de instalar

### "Error: ENOENT: no such file or directory"
- Estás en la carpeta incorrecta
- Asegúrate de estar en `sistema-turnos-medicos/`
- Usa `cd sistema-turnos-medicos`

### "Puerto 3000 ya está en uso"
```bash
# Usa otro puerto
npm start -- --port 3001
```

### "Error de conexión a SheetDB"
- Verifica que `.env` tiene la URL correcta
- Sin espacios adicionales
- Recarga la página (Ctrl+Shift+R)

---

## 📊 SIGUIENTE PASO

Una vez que funciona localmente:

1. **Deploy a Vercel** - Ver [CONFIGURACION.md](CONFIGURACION.md#-deploy-a-vercel-gratis)
2. **Personalizar horarios** - Edita Google Sheets
3. **Mejorar la app** - Lee [REQUISITOS.md](REQUISITOS.md)

---

## ✅ INSTALACIÓN COMPLETADA

¡Felicidades! 🎉 Tu app está lista.

Pruébala, experimenta, personaliza.

**¿Dudas?** Abre un Issue en GitHub.
