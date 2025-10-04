# Ganga River Water Quality Monitoring & Forecasting (MERN)

Simple, hackathon-friendly MERN app to visualize water quality along the Ganga, with:
- Map with monitoring locations
- Time-series chart: last 10 days + 3-day forecast
- Basic alerts when thresholds are crossed (with live SSE stream)
- Mock/simulated data with a rules-based forecast
- Citizen/Admin login, photo report, biodiversity per location, chatbot, and disaster notifications

Tech stack
- Frontend: React + Vite, react-leaflet (map), recharts (charts)
- Backend: Node.js, Express, Mongoose
- Database: MongoDB (local or Atlas)

Key features
- Locations: Haridwar, Kanpur, Varanasi, Patna, Kolkata
- Parameters: DO, BOD, Nitrate, Fecal Coliform
- Forecast: 3 days ahead using a simple model (moving average + rainfall effects)
- Alerts: Triggered if parameter crosses threshold (SSE live updates, optional SMS/Email)
- Reports: Citizens can submit issues with photos and geolocation
- Biodiversity: Sample species per location
- Chatbot: Rule-based helper
- Disaster notifications: Simple flood risk rule (high rainfall + flow) with optional SMS/Email and Web Push

Thresholds (demo)
- DO: alert if < 5 mg/L
- BOD: alert if > 3 mg/L
- Nitrate: alert if > 10 mg/L
- Fecal Coliform: alert if > 2500 CFU/100mL

Directory structure
- server/: Express API, MongoDB models, seed & forecast scripts
- client/: React dashboard with map & charts, auth, chatbot, reports

Quickstart (Windows PowerShell)
1) Requirements
   - Node.js 18+ and npm
   - MongoDB (Local) OR MongoDB Atlas connection string

2) Configure environment variables
   - Copy server/.env.example to server/.env and set MONGODB_URI, PORT, CLIENT_URL, JWT_SECRET (optional: ADMIN_EMAILS/ADMIN_PHONES, Twilio/SMTP, VAPID keys for Web Push)
   - Copy client/.env.example to client/.env and set VITE_API_BASE_URL

3) Install dependencies
   - npm run install:all

4) Seed mock data (last 10 days)
   - npm run seed

5) Compute 3-day forecasts
   - npm run forecast

6) Start dev servers (API + web)
   - npm run dev
   - Open http://localhost:5173

7) Enable Web Push (optional)
   - Generate keys: npx web-push generate-vapid-keys
   - Put VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT in server/.env and restart API
   - In the top nav, click "Enable Push"

Environment variables
- Server (server/.env):
  - MONGODB_URI=mongodb://localhost:27017/ganga (or Atlas URI)
  - PORT=4000
  - CLIENT_URL=http://localhost:5173
  - JWT_SECRET=change_this_in_prod
  - UPLOAD_DIR=./server/uploads
  - ADMIN_EMAILS=comma,separated,emails (optional)
  - ADMIN_PHONES=+91..., +91... (optional)
  - (Optional SMS) TWILIO_ACCOUNT_SID=, TWILIO_AUTH_TOKEN=, TWILIO_FROM=
  - (Optional Email) SMTP_HOST=, SMTP_PORT=587, SMTP_USER=, SMTP_PASS=, SMTP_FROM=noreply@ganga.local
  - (Web Push) VAPID_PUBLIC_KEY=, VAPID_PRIVATE_KEY=, VAPID_SUBJECT=mailto:you@example.com
- Client (client/.env):
  - VITE_API_BASE_URL=http://localhost:4000

API overview (simplified)
- POST /api/auth/register | /api/auth/login
- GET /api/locations
- GET /api/timeseries?locationId=<id>&parameter=<do|bod|nitrate|fecal_coliform>
- GET /api/alerts and GET /api/alerts/stream (SSE)
- GET /api/biodiversity?locationId=<id>
- POST /api/reports (multipart/form-data: description, locationId?, lat?, lng?, photo)
- GET /api/reports (citizen sees own, admin sees all), PATCH /api/reports/:id (admin)
- GET /api/notifications
- POST /api/chatbot

Seeded users
- Admin: admin@ganga.local / Admin@123
- Citizen: citizen@ganga.local / Citizen@123

Notes
- This is a demo. Data is synthetic and for hackathon use only.
- The map uses OpenStreetMap tiles.
- Forecast is intentionally simple for speed.

