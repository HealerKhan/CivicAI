# 🏙️ CivicAI — Intelligent Municipal Complaint Management System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.4+-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white)

**An end-to-end AI-powered platform that automatically classifies, scores, and geospatially maps citizen complaints for city administrations.**

[Features](#-features) · [Architecture](#-system-architecture) · [ML Pipeline](#-ml-pipeline) · [API Reference](#-api-reference) · [Deployment](#-deployment)

</div>

---

## 📌 Overview

CivicAI transforms how municipalities handle citizen complaints. Instead of manual triage, our system uses machine learning to **automatically classify issue types**, **score complaint priority**, and **visualize incidents on a live map** — enriched with real-time nearby hospital and school data.

A citizen submits a plain-text complaint. Within seconds, the system returns:
- Predicted **issue category** (pothole, graffiti, water leak, etc.)
- **Priority level** (high / medium / low) with a numeric score
- **Geolocation** of the reported area
- **Nearby critical infrastructure** (hospitals, schools within 500m radius)
- **Area importance score** based on proximity to sensitive facilities

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 **Auto Classification** | NLP pipeline classifies complaint into issue type from free-text description |
| 📊 **Priority Scoring** | Random Forest model scores priority using severity, area importance, and citizen report count |
| 🗺️ **Live Geo-mapping** | Geocodes location via Nominatim OSM and plots on interactive Leaflet map |
| 🏥 **Facility Awareness** | Overpass API fetches hospitals & schools within 500m — elevates priority automatically |
| 📍 **Custom Map Markers** | Color-coded markers: red (high), orange (medium), green (low) + hospital/school icons |
| 🔢 **Unique Report IDs** | Every complaint gets a traceable `RPT-XXXXXX` reference ID |
| 📱 **Responsive Dashboard** | Full-width map + sidebar stats panel, mobile-ready |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CITIZEN / BROWSER                           │
└────────────────────────────┬────────────────────────────────────────┘
                             │  HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND  (Next.js 14 + TypeScript)              │
│                                                                     │
│   ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐    │
│   │ Complaint    │    │ Leaflet Map  │    │ Dashboard Panel   │    │
│   │ Form         │    │ (react-      │    │ (Stats + Nearby   │    │
│   │              │    │  leaflet)    │    │  Facilities)      │    │
│   └──────┬───────┘    └──────────────┘    └───────────────────┘    │
│          │ POST /complaints                                         │
└──────────┼──────────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND  (FastAPI + Docker)                      │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                     ML PIPELINE                             │  │
│   │                                                             │  │
│   │  Description ──► TF-IDF Vectorizer ──► Logistic Regression │  │
│   │                                             │               │  │
│   │                                    Predicted Issue Type     │  │
│   │                                                             │  │
│   │  [Severity, Area Importance,  ──► Random Forest Classifier  │  │
│   │   Citizen Count, Issue Type]        │                       │  │
│   │                                Priority Level (H/M/L)       │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│   ┌───────────────────┐      ┌──────────────────────────────────┐  │
│   │ Nominatim OSM API │      │ Overpass API                     │  │
│   │ (Geocoding)       │      │ (Nearby Hospitals & Schools)     │  │
│   │ lat, lon ◄────────┘      │ within 500m radius ◄────────────┘  │
│   └───────────────────┘      └──────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 ML Pipeline

### Model 1 — Issue Type Classifier

**Goal:** Predict the category of a complaint from its text description.

```
Input:  "There is a large pothole near the main road damaging vehicles"
Output: "pothole"
```

| Component | Detail |
|-----------|--------|
| Preprocessing | Lowercasing, regex cleaning, whitespace normalization |
| Vectorizer | TF-IDF (Term Frequency–Inverse Document Frequency) |
| Classifier | Logistic Regression |
| Input Feature | `issue_description` (raw text) |
| Output | Issue type label (graffiti, pothole, water_leak, etc.) |
| Packaging | Scikit-learn Pipeline → `category_model.pkl` |

The TF-IDF vectorizer and Logistic Regression are wrapped in a single `sklearn.pipeline.Pipeline`, so the `.pkl` file handles both vectorization and prediction in one `model.predict()` call.

---

### Model 2 — Priority Level Classifier

**Goal:** Classify complaint urgency as `high`, `medium`, or `low`.

```
Input:  [severity=9, area_importance=10, citizen_count=3, issue_type=2]
Output: "high"
```

| Component | Detail |
|-----------|--------|
| Classifier | Random Forest |
| Input Features | 4 engineered numeric features (see below) |
| Output | Priority level: `high` / `medium` / `low` |
| Packaging | `priority_model.pkl` |

**Feature Engineering:**

```python
# Feature 1: Severity Score (1–10) — rule-based from description keywords
if "accident" / "fire" / "collapse" in description:  severity = 8–10
if "broken" / "overflowing" in description:           severity = 5–7
else:                                                  severity = 1–4

# Feature 2: Area Importance (1–10) — based on nearby facilities
if hospitals nearby:   area_importance = 10
elif schools nearby:   area_importance = 9
else:                  area_importance = 2–5 (random)

# Feature 3: Citizen Reports Count — passed from API request
citizen_reports_count = data.citizen_count

# Feature 4: Issue Type Encoded — label encoded integer
issue_type_encoded = encode_issue_type(data.issue_type)
```

**Priority Score Formula** (human-readable numeric score alongside the label):

```
priority_score = (0.4 × severity) + (0.3 × normalized_citizen_count) + (0.3 × area_importance)
```

---

### Training Data & Model Files

```
ml/
├── category_model.pkl     ← TF-IDF + Logistic Regression pipeline
├── priority_model.pkl     ← Random Forest classifier
├── predictor.py           ← Inference logic + external API calls
└── encoder.py             ← Issue type label encoder
```

---

## 🌍 External APIs

### 1. Nominatim OpenStreetMap — Geocoding

Converts a user-entered location string into latitude/longitude coordinates.

```
GET https://nominatim.openstreetmap.org/search
    ?q=Peshawar, KPK
    &format=json
```

**Returns:** `latitude`, `longitude` used for map centering and Overpass queries.

---

### 2. Overpass API — Nearby Facilities

Queries OSM for hospitals and schools within a configurable radius (default: **500 meters**).

```
POST https://overpass-api.de/api/interpreter
Body:
  [out:json];
  (
    node["amenity"="hospital"](around:500, {lat}, {lon});
    node["amenity"="school"](around:500, {lat}, {lon});
  );
  out;
```

**Returns:** Named facility list with coordinates → used for area importance scoring and map markers.

---

## 📁 Project Structure

```
civicai/
│
├── backend/                         ← FastAPI application
│   ├── main.py                      ← App entry point, CORS, routes
│   ├── routers/
│   │   └── complaints.py            ← POST /complaints endpoint
│   ├── ml/
│   │   ├── predictor.py             ← Core inference + external API calls
│   │   ├── encoder.py               ← Issue type encoder
│   │   ├── category_model.pkl       ← Trained classifier (Model 1)
│   │   └── priority_model.pkl       ← Trained classifier (Model 2)
│   ├── schemas/
│   │   └── complaint.py             ← Pydantic request/response models
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env                         ← Local environment variables
│
└── frontend/                        ← Next.js 14 application
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx             ← Landing page
    │   │   ├── complaint/page.tsx   ← Form + results + map
    │   │   └── dashboard/page.tsx   ← Analytics dashboard
    │   ├── components/
    │   │   ├── form/
    │   │   │   └── ComplaintForm.tsx
    │   │   ├── map/
    │   │   │   ├── ComplaintMap.tsx ← Leaflet map (dynamic, SSR-safe)
    │   │   │   └── MapLegend.tsx
    │   │   └── ui/
    │   │       ├── DashboardPanel.tsx
    │   │       ├── StatCard.tsx
    │   │       ├── PriorityBadge.tsx
    │   │       ├── Navbar.tsx
    │   │       └── Skeleton.tsx
    │   ├── lib/
    │   │   ├── api.ts               ← Axios service layer
    │   │   └── utils.ts             ← Helpers and formatters
    │   └── types/
    │       └── complaint.ts         ← Full TypeScript interfaces
    ├── .env.local
    ├── tailwind.config.ts
    └── package.json
```

---

## 🔌 API Reference

### `POST /complaints`

Submit a new complaint for AI analysis.

**Request Body:**

```json
{
  "issue_description": "There is a large pothole near the bus terminal",
  "reporter_name": "Ahmed Khan",
  "location": "Peshawar, KPK",
  "email": "ahmed@example.com",
  "issue_type": "pothole"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `issue_description` | string | ✅ Yes | Plain-text description of the issue |
| `reporter_name` | string | No | Name of the citizen reporter |
| `location` | string | No | Address, landmark, or area name |
| `email` | string | No | Reporter's contact email |
| `issue_type` | string | No | Hint for issue category |

**Response:**

```json
{
  "report_id": "RPT-362545",
  "issue_description": "There is a large pothole near the bus terminal",
  "location": "Peshawar, KPK",
  "issue_type": "pothole",
  "priority_level": "high",
  "priority_score": 7.84,
  "severity_score": 8,
  "area_importance": 10,
  "citizen_reports_count": 1,
  "latitude": 33.9896195,
  "longitude": 71.4359588,
  "nearby": {
    "hospitals": [
      { "name": "Lady Reading Hospital", "lat": 33.99, "lon": 71.43, "type": "hospital" }
    ],
    "schools": [
      { "name": "City High School", "lat": 33.98, "lon": 71.44, "type": "school" }
    ],
    "hospital_count": 3,
    "school_count": 2
  }
}
```

---

## 🗺️ Map Visualization

The frontend uses **react-leaflet** with CARTO Dark Matter tiles for a clean dark-mode map.

| Marker | Color | Condition |
|--------|-------|-----------|
| ⚠ Incident pin | 🔴 Red | `priority_level: "high"` |
| ⚠ Incident pin | 🟠 Orange | `priority_level: "medium"` |
| ⚠ Incident pin | 🟢 Green | `priority_level: "low"` |
| 🏥 Hospital | Red | Each entry in `nearby.hospitals` |
| 🏫 School | Blue | Each entry in `nearby.schools` |

A **pulsing radius circle** is drawn around the incident location to visually represent the search area.

---

## 🚀 Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/your-username/civicai.git
cd civicai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env:
# ALLOWED_ORIGINS=http://localhost:3000
# OVERPASS_URL=https://overpass-api.de/api/interpreter
# OPEN_STREET_URL=https://nominatim.openstreetmap.org/search

# Run
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```

Open **http://localhost:3000**

### 4. Run with Docker

```bash
# From project root
docker compose up --build
```

---

## ☁️ Production Deployment

### Backend → Render

1. Push backend to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo — Render auto-detects the `Dockerfile`
4. Set environment variables in Render dashboard:

```
ALLOWED_ORIGINS   = *                    ← temporary, update after frontend deploy
OVERPASS_URL      = https://overpass-api.de/api/interpreter
OPEN_STREET_URL   = https://nominatim.openstreetmap.org/search
```

5. Deploy → copy your URL: `https://your-backend.onrender.com`

### Frontend → Vercel

1. Push frontend to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo
3. Set environment variable:

```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

4. Deploy → copy your URL: `https://your-app.vercel.app`

### Final Step — Update CORS on Render

Go back to Render → Environment Variables → update:

```
ALLOWED_ORIGINS = https://your-app.vercel.app
```

Render auto-redeploys. ✅

---

## 🔐 Environment Variables Reference

### Backend (`.env`)

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |
| `OVERPASS_URL` | `https://overpass-api.de/api/interpreter` | Overpass API endpoint |
| `OPEN_STREET_URL` | `https://nominatim.openstreetmap.org/search` | Nominatim geocoding endpoint |

### Frontend (`.env.local`)

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI backend base URL |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | REST API framework |
| **scikit-learn** | ML model training and inference |
| **TF-IDF Vectorizer** | Text feature extraction |
| **Logistic Regression** | Issue type classification |
| **Random Forest** | Priority level classification |
| **joblib** | Model serialization (.pkl) |
| **httpx** | Async HTTP client for external APIs |
| **python-dotenv** | Environment variable management |
| **Docker** | Containerization |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **react-leaflet** | Interactive map rendering |
| **Leaflet** | Map engine (CARTO dark tiles) |
| **Axios** | HTTP client with error handling |
| **lucide-react** | Icon library |

### External APIs
| API | Purpose |
|-----|---------|
| **Nominatim (OSM)** | Free geocoding — location string → lat/lon |
| **Overpass API** | Free OSM query — nearby hospitals & schools |

---

## 📊 Priority Scoring Logic

```
┌─────────────────────────────────────────────────────────┐
│                   PRIORITY DECISION TREE                │
│                                                         │
│  Description Keywords                                   │
│       │                                                 │
│       ├── "accident/fire/collapse/injured"              │
│       │         └─► Severity: 8–10                      │
│       │                                                 │
│       ├── "broken/overflowing/large/not working"        │
│       │         └─► Severity: 5–7                       │
│       │                                                 │
│       └── Other                                         │
│                 └─► Severity: 1–4                       │
│                                                         │
│  Nearby Facilities (500m radius via Overpass)           │
│       │                                                 │
│       ├── Hospitals found  └─► Area Importance: 10      │
│       ├── Schools found    └─► Area Importance: 9       │
│       └── None             └─► Area Importance: 2–5     │
│                                                         │
│  Final Score:                                           │
│  0.4×Severity + 0.3×(CitizenCount/50×10) + 0.3×Area   │
└─────────────────────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Built with ❤️ for smarter cities.

---

<div align="center">
  <sub>CivicAI — Turning citizen complaints into actionable intelligence.</sub>
</div>
