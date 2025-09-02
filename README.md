# TrueStock / Frontend

Frontend de **TrueStock** construido con **Next.js 14 + TypeScript**.

## Features
- Gestión de sociedades
- Gestión de proyectos
- Mantenedores

## Tech
- React 18
- Next.js 14 (App Router)
- TypeScript 5
- Axios 1.x
- Husky + Commitlint + lint-staged + Prettier

---

## Requisitos
- **Node.js** ≥ 18.17 (recomendado 20.x)
- **pnpm** instalado globalmente (`npm i -g pnpm`)
- **Git**
- IDE recomendado: **WebStorm** (ver sección más abajo)

---

## Arranque rápido — Modo B (URL directa)

Este modo hace que el **cliente (navegador)** llame **directamente** al backend.
> La **URL del backend** es provista por la infraestructura/backend (proxy o configuración central).  
> El frontend **no requiere** configurar variables de entorno locales.

1. **Instalar dependencias**  
   Ejecuta `pnpm install`.

2. **Iniciar el proyecto**  
   Ejecuta `pnpm dev` (o `pnpm run dev`) y abre **http://localhost:3000**.

3. **Build y producción**
    - Compilar: `pnpm build`
    - Ejecutar: `pnpm start`

---

## Scripts
- `dev` → servidor de desarrollo Next
- `build` → compila para producción
- `start` → ejecuta en producción
- `lint` → corre ESLint
- `prettier` → formatea el código
- `prepare` → instala hooks de Husky

---

## Estructura del proyecto


### ¿Para qué sirve cada carpeta?
- **src/app/**: define rutas y layouts usando el App Router de Next.
- **src/assets/**: archivos importables (por ejemplo SVG como componente). Para archivos estáticos públicos, usa `public/`.
- **src/auth/**: autenticación/SSO y protección de rutas (placeholder a futuro).
- **src/components/**: piezas UI reutilizables y atómicas.
- **src/config/**: configuración global (constantes, toggles).
- **src/context/**: Providers de React para estado global (tema, sesión, permisos).
- **src/enums/**: enumeraciones TypeScript centralizadas.
- **src/helpers/**: funciones de ayuda orientadas al dominio (sin dependencias de React).
- **src/hooks/**: custom hooks (`useXxx`) que encapsulan lógica de UI/datos.
- **src/model/**: tipos/interfaces de dominio (entidades, DTOs, contratos).
- **src/routes/**: rutas y enlaces centralizados para evitar strings hardcodeados.
- **src/sections/**: bloques/páginas compuestas por varios componentes.
- **src/services/**: integración con APIs (cliente HTTP y métodos por recurso).
- **src/themes/**: sistema de diseño/tema (tokens, temas de MUI).
- **src/utils/**: utilidades puras reutilizables (formatos, parsers, helpers genéricos).
- **public/**: archivos que deben servirse directamente (favicon, imágenes públicas).

---

## IDE recomendado: WebStorm
- Inspecciones de código para React/TS/Next.
- Integración con ESLint y Prettier (formato al guardar).
- Git integrado y soporte para hooks.
- Run Configurations para `pnpm dev`, `pnpm build`.

**Pasos sugeridos:**
1. Abrir la carpeta del proyecto y marcar **Trust Project**.
2. Seleccionar Node interpreter (Auto) y habilitar **pnpm**.
3. Ejecutar `pnpm install`.
4. Ejecutar `pnpm dev` desde Run/Debug.

---

## Troubleshooting
- **La API no responde / 404**: confirma con el equipo backend la URL expuesta por el proxy/infraestructura.
- **CORS**: si hay errores CORS, el backend debe habilitar el origen `http://localhost:3000`.
- **Errores de lint o tipos**: ejecuta `pnpm lint` y corrige los avisos; revisa Typescript si corresponde.

---

## Autorización (futuro)
La carpeta `src/auth/` está pensada para integrar Azure/MSAL (SSO corporativo) cuando se habilite.


## Convenciones de commits (Commitlint + Conventional Commits)

Usamos **Conventional Commits** para mensajes consistentes y releases automáticos.

**Formato:**

**Reglas principales:**
- Escribe el **resumen** en **imperativo**, sin punto final. Ej: `agrega`, `corrige`, `refactoriza`.
- Longitud recomendada del resumen: **≤ 72 caracteres**.
- Deja una línea en blanco y luego el **cuerpo** (opcional) con más contexto.
- En el **footer** puedes referenciar issues: `Closes #123`.
- Cambios incompatibles: usa `feat!: ...` **o** agrega en el cuerpo `BREAKING CHANGE: descripción`.

**Tipos aceptados (más comunes):**
- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `docs` — sólo documentación (README, comentarios, etc.)
- `style` — cambios de formato (espacios, comillas) sin afectar el código
- `refactor` — cambios internos que no corrigen ni agregan features
- `perf` — mejoras de rendimiento
- `test` — añadir/ajustar tests
- `build` — cambios en build, dependencias, bundlers
- `ci` — cambios de pipelines/CI
- `chore` — tareas varias (no código de app)
- `revert` — revertir un commit previo

**Alcances (ejemplos):**
- `app`, `components`, `services`, `auth`, `routes`, `themes`, `utils`, `config`, `docs`

**Ejemplos válidos:**
