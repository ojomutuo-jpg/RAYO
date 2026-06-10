# RAYO

Proyecto web simple con un archivo `rayo-app.html` y documentación en Markdown.

## Estructura

- `rayo-app.html` - aplicación principal.
- `MD. para claude/Que es fullfilment.md` - documentación o notas del proyecto.

## Uso

Abre `rayo-app.html` en un navegador para ver la aplicación.

## Licencia

Este repositorio se creó para uso personal.

## Backend local

1. Instala Node.js en tu máquina.
2. Abre una terminal en la carpeta del proyecto `RAYO`.
3. Ejecuta `npm install`.
4. Ejecuta `npm start`.
5. Abre `http://localhost:3000` en el navegador.

## Integraciones: GitHub, Vercel y Supabase

Este repositorio incluye archivos de configuración iniciales para facilitar la conexión con GitHub, Vercel y Supabase:

- ` .github/workflows/ci.yml`: flujo básico de CI para instalar dependencias y ejecutar `npm test`.
- `vercel.json`: ejemplo de configuración para desplegar el frontend en Vercel (serve static `rayo-app.html`).
- `src/supabase-client.js`: ejemplo de inicialización de cliente Supabase usando variables de entorno.
- `.env.example`: variables de entorno de ejemplo para Supabase y tokens de despliegue.

Pasos recomendados para completar la integración:

1. Crea un repositorio en GitHub y sube este código.
2. (Opcional) Activa GitHub Actions en el repositorio — la CI definida se ejecutará en cada push.
3. En Vercel, conecta el repositorio de GitHub para despliegue automático del frontend. En Vercel agrega las variables de entorno `SUPABASE_URL` y `SUPABASE_ANON_KEY` si tu frontend o funciones las usan.
4. Crea un proyecto en Supabase y copia `SUPABASE_URL` y `SUPABASE_ANON_KEY` en las variables de entorno del host (Vercel, GitHub Secrets o un archivo `.env` local).
5. Si quieres que Vercel despliegue también la API Node (`server.js`), revisa la guía de Vercel para aplicaciones Node completas o considera desplegar el backend en una plataforma dedicada (Heroku, Railway, Render) y apuntar `vercel.json` o el frontend a la URL del backend.

Nota: No se incluyen tokens ni secretos en este repositorio; añade `VERCEL_TOKEN` o `GITHUB_TOKEN` en los secretos del repositorio si quieres automatizar despliegues desde Actions.

## Pasos para subir a GitHub y desplegar

1. Inicializa el repositorio localmente (si no lo está) y haz commit:

```bash
git init
git add .
git commit -m "Initial project + CI/Vercel/Supabase configs"
git branch -M main
```

2. Crea un repositorio en GitHub y añade el remoto, luego push:

```bash
git remote add origin git@github.com:TU_USUARIO/TU_REPO.git
git push -u origin main
```

3. En GitHub, agrega los secretos del repositorio (Settings → Secrets):
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — para el workflow de despliegue a Vercel.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` — si necesitas que Actions o el frontend accedan a Supabase.

4. En Vercel, conecta el repositorio de GitHub y configura las mismas variables de entorno en el proyecto para despliegue.

5. Para desplegar el backend en una plataforma como Heroku/Render/Railway, puedes usar el `Procfile` incluido: la app se iniciará con `node server.js`.

Si quieres, puedo ejecutar los comandos `git init` y hacer el commit local por ti ahora. Para hacer push necesito que me indiques el repositorio remoto o que lo hagas desde tu máquina con las credenciales.
