# Spraada Frontend

Next.js 16 client for Spraada — a peer-to-peer tool rental marketplace. Handles browsing, listing, booking, real-time messaging, and notifications through a server-side-rendered React 19 application.

## Tech Stack

| Concern              | Technology                                        |
| -------------------- | ------------------------------------------------- |
| Framework            | Next.js 16 (App Router)                           |
| Language             | TypeScript 5                                      |
| UI Library           | React 19                                          |
| Styling              | Tailwind CSS 4                                    |
| Component primitives | Radix UI (`@radix-ui/react-*`)                    |
| State management     | Zustand 5 + Immer                                 |
| Forms                | React Hook Form 7 + Zod 4                         |
| Real-time            | Socket.IO client 4                                |
| Maps                 | Mapbox GL JS 3                                    |
| Session / auth       | `jose` (JWT encryption in Next.js Route Handlers) |
| Animations           | Framer Motion 12                                  |
| Notifications        | react-hot-toast                                   |
| Rich text            | Quill 2                                           |
| Image processing     | react-image-crop, heic2any                        |

---

## Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** ≥ 9
- **Spraada Backend** running (see `../spraada_backend/README.md`)
- A **Mapbox** account for the interactive map feature

---

## Local Development Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` in the project root. Next.js automatically loads this file and never exposes server-only variables (those without the `NEXT_PUBLIC_` prefix) to the browser bundle.

```env
# ── Backend ───────────────────────────────────────────────────────────────────
# URL of the Spraada NestJS API
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4444

# ── Frontend ──────────────────────────────────────────────────────────────────
# Canonical URL of this Next.js app (used for OAuth callbacks and CORS)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# ── Session ───────────────────────────────────────────────────────────────────
# 32-byte secret used to encrypt the iron-session cookie
# Generate with: openssl rand -hex 32
SESSION_SECRET=<random-64-char-hex>

# ── Mapbox ────────────────────────────────────────────────────────────────────
# Public access token from https://account.mapbox.com
# Required for the interactive tool location map
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoiLi4uIn0...
```

> `SESSION_SECRET` is a **server-only** variable (no `NEXT_PUBLIC_` prefix). It never reaches the client bundle.

### 3. Start the development server

```bash
npm run dev
```

The app is available at **http://localhost:3000**.

---

## NPM Scripts

| Script          | Description                                         |
| --------------- | --------------------------------------------------- |
| `npm run dev`   | Start Next.js in development mode with Fast Refresh |
| `npm run build` | Build for production (runs type-check + bundling)   |
| `npm run start` | Serve the production build                          |
| `npm run lint`  | Run ESLint                                          |

---

## Application Routes

All authenticated routes are protected by middleware that validates the encrypted session cookie. Unauthenticated requests are redirected to `/signin`.

### Public routes

| Route              | Description                             |
| ------------------ | --------------------------------------- |
| `/signin`          | Email/password and Google OAuth sign-in |
| `/signup`          | New user registration                   |
| `/forgot_password` | Initiate password-reset flow            |
| `/reset_password`  | Set a new password via email token      |
| `/privacy-policy`  | Static privacy policy page              |
| `/terms`           | Static terms of service page            |

### Authenticated routes

| Route                          | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `/`                            | Home — featured / random tool listings              |
| `/browse`                      | Search and filter all available tools               |
| `/create`                      | List a new tool for rent                            |
| `/toolbox`                     | Manage your own tool listings                       |
| `/toolbox/edit/[toolId]`       | Edit an existing listing                            |
| `/toolbox/view/[toolId]`       | Borrower's tool detail + booking modal + Mapbox map |
| `/toolbox/view/[toolId]/owner` | Owner's view of their own listing                   |
| `/borrowed`                    | Bookings where you are the borrower                 |
| `/rentals`                     | Bookings where you are the tool owner               |
| `/transactions`                | Full transaction history                            |
| `/messages`                    | Real-time conversation inbox                        |
| `/profile/[id]`                | User profile (public and own)                       |
| `/settings`                    | Account and preference settings                     |
| `/report`                      | Report a user or listing                            |

---

## State Management

Client-side state is handled by **Zustand 5** stores (with Immer for immutable updates). Each domain owns a dedicated store file under `store/`:

| Store            | Responsibility                                        |
| ---------------- | ----------------------------------------------------- |
| `tool/`          | Tool listings, search results, toolbox, favourites    |
| `booking/`       | Booking lifecycle, status updates                     |
| `conversations/` | Conversation list, unread counters, real-time updates |
| `messages/`      | Message history per conversation, pagination          |
| `notifications/` | Notification list and counters                        |
| `profile/`       | Authenticated user's profile data                     |

Stores are composed and re-exported from `store/index.ts`.

---

## Session & Authentication

Authentication uses **encrypted server-side sessions** — not `localStorage`. The flow is:

1. The user submits credentials; the backend returns `access_token` + `refresh_token`.
2. Next.js Route Handlers (`app/api/auth/*`) encrypt the tokens with `NEXT_PUBLIC_SESSION_SECRET` via `jose` and write a `HttpOnly; Secure; SameSite=Lax` cookie.
3. Server Components and middleware read the session directly from the cookie using `lib/session/session.ts`.
4. Tokens are refreshed transparently before expiry through `POST /api/auth/update-session-token`.

---

## Real-time (Socket.IO)

The `lib/socket/` module initialises a single Socket.IO client instance that is reused across the app. The socket connects after a successful sign-in and disconnects on sign-out.

Key events consumed by the Zustand stores:

- `newMessage` → appended to the active conversation's message list
- `notification` → prepended to the notification list and increments the counter

---

## Environment Variables Reference

| Variable                      | Scope           | Required | Description                                                 |
| ----------------------------- | --------------- | -------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_BACKEND_API_URL` | Client + Server | ✓        | Base URL of the Spraada NestJS API                          |
| `NEXT_PUBLIC_FRONTEND_URL`    | Client + Server | ✓        | Canonical URL of this app                                   |
| `SESSION_SECRET`              | Server only     | ✓        | 32-byte hex secret for session cookie encryption            |
| `NEXT_PUBLIC_MAPBOX_TOKEN`    | Client only     | ✓        | Mapbox public access token (map will not render without it) |

---

## Project Structure

```
app/
├── (auth)/                    # Unauthenticated layout group
│   ├── (base)/
│   │   ├── signin/            # Sign-in page
│   │   └── signup/            # Sign-up page
│   ├── forgot_password/
│   └── reset_password/
├── (root)/                    # Authenticated layout group (middleware-protected)
│   ├── page.tsx               # Home / featured tools
│   ├── browse/                # Tool search + filters
│   ├── create/                # Add tool listing
│   ├── toolbox/               # My tools management
│   │   ├── edit/[toolId]/
│   │   └── view/[toolId]/
│   ├── borrowed/              # Borrower booking history
│   ├── rentals/               # Owner rental history
│   ├── transactions/
│   ├── messages/              # Real-time chat inbox
│   ├── profile/[id]/
│   ├── settings/
│   └── report/
├── api/
│   └── auth/                  # Route Handlers: session read/write, token refresh, sign-out, Google callback
├── privacy-policy/
└── terms/

components/
├── Tools/                     # ToolCard, AddToolForm, EditToolForm, ImageGallery, ToolMap
├── Booking/                   # BookingModal, booking status UI
├── Messages/                  # Chat, ChatLeftUser, MessageBubble
├── Notifications/             # NotificationList, NotificationBadge
├── Profile/                   # ProfileHeader, ProfileForm
├── ui/                        # SpraadaButton, Loading, shared primitives

store/
├── tool/
├── booking/
├── conversations/
├── messages/
├── notifications/
├── profile/
└── index.ts                   # Unified re-export

lib/
├── actions/                   # Server Actions: tools.actions.ts, profile.actions.ts, booking.actions.ts
├── session/                   # getSession(), updateSession() helpers
├── helpers/                   # dateHelpers, formatters
└── socket/                    # Socket.IO client singleton

types/                         # Shared TypeScript interfaces
Hooks/                         # Custom React hooks
```

---

## Code Splitting

Heavy client components are loaded with `next/dynamic` to reduce the initial JS bundle:

| Component          | Route                    | Approx. size     |
| ------------------ | ------------------------ | ---------------- |
| `AddToolForm`      | `/create`                | 636 lines        |
| `EditToolForm`     | `/toolbox/edit/[toolId]` | 681 lines        |
| `BookingModal`     | `/toolbox/view/[toolId]` | 612 lines        |
| `ToolMap` (Mapbox) | `/toolbox/view/[toolId]` | Mapbox GL bundle |
| `Chat`             | `/messages`              | Full chat UI     |

Each is rendered behind a `<LoadingUI />` skeleton while the chunk loads.

---

## Production Deployment

```bash
npm run build
npm run start
```

Ensure all four environment variables are set in your hosting environment. For Vercel, add them in **Project → Settings → Environment Variables** and trigger a redeploy.

> The `SESSION_SECRET` must be identical across all instances and deployments — rotating it invalidates all existing sessions.

---

## Troubleshooting

### Blank map / map not loading

- Confirm `NEXT_PUBLIC_MAPBOX_TOKEN` is set in `.env.local`.
- Token must have the **Maps** scope enabled in your Mapbox account.
- The `ToolMap` component renders `null` when the token is absent rather than throwing.

### Session not persisting / redirect loop

- Verify `SESSION_SECRET` is set and has not changed between restarts.
- Clear browser cookies for `localhost` and try again.
- Confirm the backend is reachable at `NEXT_PUBLIC_BACKEND_API_URL`.

### Socket.IO not connecting

- The backend must be running and accepting WebSocket upgrades on `NEXT_PUBLIC_BACKEND_API_URL`.
- Check the browser console for `WebSocket connection failed` — this usually means the API URL is incorrect or the backend is not running.

### Build errors

```bash
# Clear Next.js build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules && npm install

# Rebuild
npm run build
```
