# Pixel Perfect Films Institute (PPFI)

Production-grade SaaS platform for **Pixel Perfect Films Institute** — the education arm of Pixel Perfect Films. Supports two business models on shared infrastructure: **B2C** (direct-to-student courses) and **B2B** (institute partnerships).

> Source of truth: `PPFI_Project_Handover_Document`. Business logic, roles and scope come from that document — this app implements it.

## Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + Shadcn UI (New York) |
| Animation | Framer Motion |
| Database | MongoDB + Mongoose |
| Auth | NextAuth (Credentials, JWT sessions) |
| Media | Cloudinary |
| Payments | Razorpay |
| Email | Resend |
| Hosting | Vercel |

## Getting Started

```bash
cd ppfi
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (no emit) |
| `npm run format` | Prettier write |

## Project Structure

```
src/
├── app/            # App Router routes, layouts, API handlers
├── components/     # Shared UI
│   └── ui/         # Shadcn primitives
├── features/       # Feature-based modules (auth, courses, admin, …)
├── server/         # Server-only code
│   ├── db/         # Mongoose connection
│   ├── db/models/  # Mongoose models
│   └── actions/    # Server actions
├── lib/            # Framework-agnostic utilities
├── hooks/          # React hooks
├── config/         # env, site, roles configuration
├── types/          # Shared TypeScript types
└── styles/         # Additional styles
```

## Build Phases

1. ✅ **Phase 1** — Project initialization & foundation
2. ⏳ Phase 2 — Authentication (login, signup, roles, protected routes)
3. ⏳ Phase 3 — Public website
4. ⏳ Phase 4 — Student dashboard
5. ⏳ Phase 5 — Admin panel
6. ⏳ Phase 6 — Payments (Razorpay)
7. ⏳ Phase 7 — Certificates
8. ⏳ Phase 8 — SEO
9. ⏳ Phase 9 — Deployment
