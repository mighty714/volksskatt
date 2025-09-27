# volksskatt (Frontend Only)

A React + Vite + Tailwind CSS frontend for HR/ATS features (login, clock in/out, attendance, jobs, candidates, interviews, documents, offers). No backend included.

## Prerequisites

- Node.js 18+ and npm (for development)
- Python 3 (optional, to serve the production build without Node)

## Getting Started (Development)

```bash
npm install
npm run dev
```

Open the URL shown (typically http://localhost:5173).

## Build for Production

```bash
npm run build
```

This creates the static site in `dist/`.

## Serve Production Build via Python

```bash
npm run build
npm run serve:python
```

This serves `dist/` on http://localhost:5174 with SPA fallback handling.

## Structure

- Top-level
  - `src/main.jsx` – App bootstrap, wraps app with `BrowserRouter` and `ToastProvider`
  - `src/App.jsx` – Application routes, role guards (`HRRoute`, `EmployeeRoute`, `AdminRoute`)
  - `src/index.css` – Global styles (Tailwind)

- Components (`src/components/`)
  - `Layout.jsx` – HR area shell (sidebar/topbar) for `/app/*`
  - `AdminLayout.jsx` – Admin area shell for `/admin/*`
  - `EmployeeLayout.jsx` – Employee area shell for `/employee/*`
  - `Toast.jsx` – Simple toast context/provider (`ToastProvider`, `useToast`)

- Pages (`src/pages/`)
  - Public
    - `Login.jsx` – Generic login with role selector (Admin/HR/Employee)
    - `AdminLogin.jsx` – Role-specific admin login
    - `HRLogin.jsx` – Role-specific HR login
    - `EmployeeLogin.jsx` – Role-specific employee login
    - `CareersHome.jsx`, `Contact.jsx`, etc. – Public marketing pages
  - HR (`src/pages/hr/`)
    - `Home.jsx` – Public landing home used at root `/`
    - `Dashboard.jsx` – HR dashboard (under `/app/dashboard`)
    - `HrClock.jsx` – HR clock (separate storage `attendance_hr`)
    - `Attendance.jsx` – HR attendance viewer with dataset selector (HR vs Employee), CSV export
    - `AddEmployee.jsx` – User management (create/edit Admin/HR/Employee users)
    - `Documents.jsx`, `Jobs.jsx`, `Interviews.jsx`, `TeamReports.jsx`, `TalentNetworkSubmissions.jsx` – HR features
  - Employee (`src/pages/employee/`)
    - `Dashboard.jsx` – Employee dashboard (under `/employee/dashboard`)
    - `ClockEmp.jsx` – Employee clock (storage `attendance_emp`)
    - `Attendance.jsx` – Employee’s own attendance table and CSV
    - `Documents.jsx`, `Jobs.jsx`, `Leave.jsx` – Employee features
  - Admin (`src/pages/admin/`)
    - `Dashboard.jsx`, `Users.jsx`, `Attendance.jsx`, `Documents.jsx`, `Jobs.jsx`, `Interviews.jsx`, `Reports.jsx`, `Settings.jsx`

- Utilities (`src/pages/utils/`)
  - `useClock.js` – Shared hook for clock-in/out/lunch logic and CSV
  - `quotes.js` – Random motivational quotes
  - `dateUtils.js` – Date formatting helper (used where needed)

- Services (`src/services/`)
  - `auth.js` – Mock auth using `localStorage` with two modes:
    - Validates against `users_db` (created via `AddEmployee.jsx`) using username/email + password
    - Falls back to simple role-based mock when no user match

- Tooling
  - `tailwind.config.js`, `postcss.config.js` – Tailwind setup
  - `serve.py` – Simple Python static server for the production build

```text
src/
├─ App.jsx
├─ main.jsx
├─ index.css
├─ components/
│  ├─ Layout.jsx
│  ├─ AdminLayout.jsx
│  ├─ EmployeeLayout.jsx
│  └─ Toast.jsx
├─ pages/
│  ├─ Login.jsx
│  ├─ AdminLogin.jsx
│  ├─ HRLogin.jsx
│  ├─ EmployeeLogin.jsx
│  ├─ CareersHome.jsx
│  ├─ Contact.jsx
│  ├─ hr/
│  │  ├─ Dashboard.jsx
│  │  ├─ HrClock.jsx
│  │  ├─ Attendance.jsx
│  │  ├─ AddEmployee.jsx
│  │  ├─ Documents.jsx
│  │  ├─ Jobs.jsx
│  │  ├─ Interviews.jsx
│  │  ├─ TeamReports.jsx
│  │  └─ TalentNetworkSubmissions.jsx
│  ├─ employee/
│  │  ├─ Dashboard.jsx
│  │  ├─ ClockEmp.jsx
│  │  ├─ Attendance.jsx
│  │  ├─ Documents.jsx
│  │  ├─ Jobs.jsx
│  │  └─ Leave.jsx
│  ├─ admin/
│  │  ├─ Dashboard.jsx
│  │  ├─ Users.jsx
│  │  ├─ Attendance.jsx
│  │  ├─ Jobs.jsx
│  │  ├─ Interviews.jsx
│  │  ├─ Documents.jsx
│  │  ├─ Reports.jsx
│  │  └─ Settings.jsx
│  └─ utils/
│     ├─ useClock.js
│     ├─ quotes.js
│     └─ dateUtils.js
└─ services/
   └─ auth.js
```

### Key routes

- Generic login with role selector: `/login`
- Role-specific logins: `/login-admin`, `/login-hr`, `/login-employee`
- HR area (guarded): `/app/*` (default redirect to `/app/clock`)
- Admin area (guarded): `/admin/*`
- Employee area (guarded): `/employee/*`

## Notes

- This is a mock UI using in-memory data. Replace services with real API calls when you add a backend.
- Routing is protected by a simple mock `isAuthenticated()` check.
# volksskatt
