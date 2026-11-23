# CivicAI — Municipal Complaint Frontend

A production-ready Next.js 14 frontend for an AI-powered municipal complaint reporting system.

---

##  Project Structure

```
municipal-ai/
├── src/
│   ├── app/
│   │   ├── globals.css           ← Global styles, Leaflet overrides, animations
│   │   ├── layout.tsx            ← Root layout (fonts, metadata)
│   │   ├── page.tsx              ← Landing page
│   │   ├── complaint/
│   │   │   ├── layout.tsx        ← Complaint section layout
│   │   │   └── page.tsx          ← Form + results + map page
│   │   └── dashboard/
│   │       ├── layout.tsx        ← Dashboard section layout
│   │       └── page.tsx          ← Analytics dashboard page
│   ├── components/
│   │   ├── form/
│   │   │   └── ComplaintForm.tsx ← Controlled form with validation
│   │   ├── map/
│   │   │   ├── ComplaintMap.tsx  ← Leaflet map (dynamic, no SSR)
│   │   │   └── MapLegend.tsx     ← Map legend overlay
│   │   └── ui/
│   │       ├── DashboardPanel.tsx← Stats + facility lists
│   │       ├── Navbar.tsx        ← Top navigation bar
│   │       ├── PriorityBadge.tsx ← Color-coded priority pill
│   │       ├── Skeleton.tsx      ← Loading skeleton components
│   │       └── StatCard.tsx      ← Metric card component
│   ├── lib/
│   │   ├── api.ts                ← Axios API service layer
│   │   └── utils.ts              ← Formatters and helpers
│   └── types/
│       └── complaint.ts          ← Full TypeScript types
├── .env.local                    ← Environment variables
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚡ Quick Start

### 1. Prerequisites

- Node.js 18+ 
- npm or yarn
- Your FastAPI backend running at `http://localhost:8000`

### 2. Install dependencies

```bash
cd municipal-ai
npm install
```

### 3. Configure environment

```bash
# Edit .env.local if your backend runs on a different port/host
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build

```bash
npm run build
npm run start
```

---

## 🚀 Features

### `/complaint` — Report an Issue
- Full complaint form (description, type, location, name, email)
- Real-time API call to FastAPI `/complaints`
- Loading states with animated spinner
- Error handling with user-friendly messages
- Results panel with:
  - Leaflet map with custom markers
  - Priority-colored main incident marker
  - Hospital markers (🏥)
  - School markers (🏫)
  - Pulsing radius circle
  - Dashboard stats panel

### `/dashboard` — Analytics View
- Full-width map sidebar layout
- Demo data loader (calls real backend)
- Sticky sidebar with scrollable stats
- All stat cards, facility lists, coordinates

---

## 🗺️ Map Details

Uses `react-leaflet` with CARTO Dark Matter tiles.

| Marker | Color | Meaning |
|--------|-------|---------|
| ⚠ Red  | `#EF4444` | High priority incident |
| ⚠ Orange | `#F97316` | Medium priority incident |
| ⚠ Green | `#22C55E` | Low priority incident |
|  | `#EF4444` | Nearby hospital |
|  | `#3B82F6` | Nearby school |

---

## 🔌 CORS Note

If your FastAPI backend doesn't already allow `http://localhost:3000`, add this to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

##  Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 14.2 | App Router framework |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4 | Utility styling |
| react-leaflet | 4.x | Interactive maps |
| leaflet | 1.9 | Map engine |
| axios | 1.7 | HTTP client |
| lucide-react | 0.400 | Icons |
| clsx | 2.x | Conditional classnames |
