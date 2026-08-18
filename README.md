# Rent.ca

Canadian rental listings marketplace with advanced search, interactive maps, and AI-powered assistance.

## Features

- **Property Search** — Filter by city, price, bedrooms, property type, amenities, pets, and more
- **Interactive Map** — Google Maps split-view with clustered price pins and bidirectional hover sync
- **AI Assistant** — Chat widget powered by Claude Sonnet with natural language search, alerts, and city info
- **Landlord Portal** — Dashboard, listings CRUD (5-step form), inquiry inbox, account management
- **Renter Portal** — Dashboard, favorites, search alerts, sent inquiries, account management
- **Listing Detail** — Photo gallery, floor plans, amenities, contact form, rent specials, similar rentals
- **Auth** — Email/password + Google OAuth with role-based routing (renter/landlord)
- **Dark/Light Mode** — Full theme support with glass design system
- **Bilingual** — English and French (next-intl)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styles | Tailwind CSS 3.4 + shadcn/ui |
| Backend | Supabase (Auth + PostgreSQL + Storage) |
| Maps | Google Maps (`@vis.gl/react-google-maps` + `@googlemaps/markerclusterer`) |
| AI | Vercel AI SDK v5 + OpenRouter (Claude Sonnet 4.5) |
| State | Zustand |
| Validation | Zod |
| i18n | next-intl (EN/FR) |

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (with tables from `src/shared/types/database.ts`)
- Google Maps API key + Map ID
- OpenRouter API key

### Setup

```bash
# Install dependencies
npm install

# Copy env template and fill in your keys
cp .env.local.example .env.local

# Start dev server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Rent.ca
OPENROUTER_API_KEY=your_openrouter_key
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   └── [locale]/                 # EN/FR locale prefix
│       ├── (public)/             # Public pages (home, search, listings)
│       ├── (auth)/               # Login, signup, password reset
│       ├── (manage)/             # Landlord portal (role-gated)
│       └── (renter)/             # Renter portal (role-gated)
├── features/                     # Feature-first modules
│   ├── auth/                     # Authentication
│   ├── homepage/                 # Hero, cities, stats, carousel
│   ├── properties/               # Property cards, grid, specs
│   ├── search/                   # Filters, sort, view toggle
│   ├── listing-detail/           # Detail page components
│   ├── map/                      # Google Maps integration
│   ├── favorites/                # Heart toggle, saved list
│   ├── alerts/                   # Search alerts
│   ├── landlord-manage/          # Landlord CRUD, inbox, dashboard
│   ├── landlord-landing/         # Marketing page
│   ├── renter-portal/            # Renter dashboard, inquiries
│   └── ai-assistant/             # Chat widget, AI tools
└── shared/                       # Reusable components, utils, types
```

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint
```

## License

Private project.
