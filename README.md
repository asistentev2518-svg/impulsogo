# Impulso Go — Plataforma unificada

Ecosistema web para **Impulso Go, S.A. de C.V., SOFOM, E.N.R.**: sitio público, firma digital, validación por folio/QR y panel interno (`/admin`).

## Requisitos

- Node.js 20+
- npm

## Instalación y arranque local

```powershell
cd c:\Users\juan_\impulso-go
copy .env.example .env.local
```

Edita `.env.local`:

- `IMPULSO_ADMIN_USER` — usuario del panel interno
- `IMPULSO_ADMIN_PASSWORD` — contraseña del panel interno
- `IMPULSO_SESSION_SECRET` — cadena aleatoria larga para firmar la sesión
- `NEXT_PUBLIC_APP_URL` — URL base (ej. `http://localhost:3000`)

```powershell
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Sitio público institucional |
| `/firma-contrato` | Wizard de firma digital (5 pasos) |
| `/validar/[folio]` | Verificación pública por folio |
| `/login` | Acceso interno discreto |
| `/admin` | Dashboard privado |
| `/admin/contrato-manual` | Contrato imprimible PNG/PDF |
| `/admin/documentos` | Generador de documentos WhatsApp |
| `/admin/tablas` | Tablas de simulación PNG |
| `/admin/expedientes` | Listado de folios |
| `/admin/configuracion` | Parámetros locales |

## Credenciales MVP

Por defecto en `.env.example`:

- Usuario: `impulso2518`
- Contraseña: `252627`

No commitear `.env.local` con secretos reales.

## Scripts

```powershell
npm run dev      # desarrollo
npm run build    # build producción
npm run start    # servidor producción
npm run lint     # ESLint
```

## Notas de seguridad (MVP)

- INE/selfie no se guardan en `localStorage` ni en disco del servidor.
- Expedientes en `data/expedientes/` solo almacenan metadatos públicos de verificación.
- Migrar autenticación y almacenamiento a backend seguro antes de producción.

## Módulo financiero

Toda simulación usa [`lib/finance.ts`](lib/finance.ts) (tasa 7% anual, plazos 2/4/6/8 años).
