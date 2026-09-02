# Eli.Py — Algoritmos y Lógica con Python

Material anexo del Taller 0 de COMPUESTUDIO. App de una sola página hecha con
Vite + React + Tailwind.

## Desarrollo local

```bash
pnpm install
pnpm dev       # http://localhost:8443
pnpm build     # genera dist/
pnpm preview   # sirve dist/ para probar el build
```

## Despliegue en GitHub Pages

El repositorio ya trae el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
que compila y publica en cada `push` a `main`.

### Pasos (solo la primera vez)

1. Crear el repositorio en GitHub y subir el proyecto:

   ```bash
   git init
   git add .
   git commit -m "Proyecto inicial"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<repo>.git
   git push -u origin main
   ```

2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

3. Esperar a que termine la acción en la pestaña **Actions**. La URL queda en
   `https://<usuario>.github.io/<repo>/`.

A partir de ahí, cada `git push` a `main` vuelve a desplegar solo.

### Notas

- La **ruta base** (`base` de Vite) la calcula el workflow a partir del nombre
  del repositorio. Si el repo se llama `<usuario>.github.io`, usa `/`; si no,
  `/<repo>/`. No hay que tocar `vite.config.ts`.
- El título, la descripción y el idioma del sitio se editan en
  [`.figma/make/site.json`](.figma/make/site.json). Ahí también está
  `robots.index`: ponlo en `false` si no quieres que los buscadores lo indexen.
- El estado del usuario (nombre, tema, progreso del taller) se guarda en el
  `localStorage` del navegador de cada visitante; no se envía a ningún servidor.
