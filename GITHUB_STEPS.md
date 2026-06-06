================================================================================
  INSTRUCCIONES PARA SUBIR A GITHUB
  Sistema de Turnos Médicos Online
================================================================================

Esta guía te ayuda a subir el proyecto a GitHub en 10 minutos.

================================================================================
📋 PASO 1: CREAR CUENTA EN GITHUB (si no la tienes)
================================================================================

1. Ve a https://github.com/
2. Clica "Sign up"
3. Llena el formulario:
   - Email
   - Contraseña
   - Username (usa: sistema-turnos-medicos)
4. Verifica tu email
5. ✅ Listo!

================================================================================
📁 PASO 2: CREAR REPOSITORIO EN GITHUB
================================================================================

1. Inicia sesión en GitHub
2. Clica el + (arriba a la derecha) → "New repository"
3. Llena los datos:
   
   Repository name:     sistema-turnos-medicos
   Description:         Sistema web para reserva de turnos médicos online
   Visibility:          Public (gratis)
   
4. ✅ Clica "Create repository"

¡Tu repositorio está creado! Copiarás la URL que verás.

================================================================================
💻 PASO 3: CONFIGURAR GIT EN TU COMPU
================================================================================

Abre la terminal y ejecuta:

# Ir a la carpeta del proyecto
cd /ruta/a/sistema-turnos-medicos

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Crear primer commit
git commit -m "Inicio del proyecto: Sistema de Turnos Médicos v2.0"

# Agregar el repositorio remoto
git remote add origin https://github.com/TUUSUARIO/sistema-turnos-medicos.git

# Subir a GitHub
git branch -M main
git push -u origin main

================================================================================
✅ VERIFICAR QUE FUNCIONÓ
================================================================================

1. Ve a tu repositorio en GitHub: 
   https://github.com/TUUSUARIO/sistema-turnos-medicos

2. Deberías ver:
   ✅ README.md
   ✅ package.json
   ✅ .gitignore
   ✅ Carpeta docs/
   ✅ Todos tus archivos

3. En la página principal verá el README con toda la documentación

================================================================================
🔑 PASO 4: GENERAR SSH KEY (Seguridad - Opcional pero recomendado)
================================================================================

Esto hace que Git no te pida contraseña cada vez.

# Generar clave SSH
ssh-keygen -t ed25519 -C "tu-email@example.com"

# Presiona ENTER 3 veces (sin cambiar contraseña)

# Ver la clave pública
cat ~/.ssh/id_ed25519.pub

# Copiar la salida (desde ssh-ed25519 hasta tu email)

Luego:
1. Ve a GitHub Settings → SSH and GPG keys
2. Clica "New SSH key"
3. Pega la clave
4. Clica "Add SSH key"

Ahora puedes hacer push sin pedir contraseña:

git remote set-url origin git@github.com:TUUSUARIO/sistema-turnos-medicos.git

================================================================================
🚀 PASO 5: CLONAR DESDE OTRO DISPOSITIVO
================================================================================

En otro dispositivo, para traer el proyecto:

git clone https://github.com/TUUSUARIO/sistema-turnos-medicos.git
cd sistema-turnos-medicos
npm install
npm start

¡Y tienes el proyecto en el otro dispositivo!

================================================================================
📝 HACER CAMBIOS Y GUARDARLOS EN GITHUB
================================================================================

Cada vez que hagas cambios:

# Ver qué cambió
git status

# Agregar cambios
git add .

# Crear commit (describe qué hiciste)
git commit -m "Descripción del cambio"

# Subir a GitHub
git push

Ejemplos de commits buenos:
- "Agrega validación de email en formulario"
- "Corrige bug de horarios duplicados"
- "Mejora responsive design"
- "Integra SheetDB en app"

================================================================================
🌳 BRANCHES (Ramas - Avanzado)
================================================================================

Para trabajar en mejoras sin afectar el código principal:

# Crear rama nueva
git checkout -b feature/mi-mejora

# Trabajar normalmente
# Hacer cambios
git add .
git commit -m "Agrega función de SMS"

# Subir la rama
git push -u origin feature/mi-mejora

# En GitHub: Clica "Compare & pull request"
# Describe qué hiciste
# Clica "Create pull request"

Luego fusionas el PR y listo!

================================================================================
📊 VER HISTORIAL DE CAMBIOS
================================================================================

# Ver últimos commits
git log --oneline

# Ver cambios de un commit específico
git show HASH_DEL_COMMIT

# Ver diferencias
git diff

# Revertir último commit (si cometiste error)
git revert HEAD

================================================================================
🔗 LINKS ÚTILES
================================================================================

Tu repositorio:
https://github.com/TUUSUARIO/sistema-turnos-medicos

Documentación de Git:
https://git-scm.com/doc

Documentación de GitHub:
https://docs.github.com/es

Git Cheatsheet:
https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf

================================================================================
❓ PROBLEMAS COMUNES
================================================================================

"Permiso denegado (publickey)"
→ Configura SSH key (PASO 4)

"fatal: not a git repository"
→ Asegúrate estar en la carpeta correcta
→ Ejecuta: git init

"error: src refspec main does not match any"
→ Hiciste commit pero no hay cambios
→ Verifica: git status

"Everything up-to-date"
→ No hay cambios nuevos
→ Haz cambios y vuelve a commit

================================================================================
✅ LISTO!
================================================================================

Ahora tu proyecto está:
✅ En GitHub
✅ Versionado
✅ Accesible desde cualquier dispositivo
✅ Listo para colaboración

¿SIGUIENTES PASOS?

1. Configura Google Sheets (CONFIGURACION.md)
2. Configura SheetDB
3. Ejecuta localmente
4. Prueba
5. Haz deploy a Vercel (gratis)

¡Felicidades! 🎉

================================================================================
