# UC SARF Portal (user side) — React + Vite

React conversion of the static SARF prototype (UC-AR-FORM-36).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Structure
- `src/App.jsx` — hash router (`#/` dashboard, `#/sarf` form)
- `src/components/Dashboard.jsx` — "My SARF Requests" table
- `src/components/sarf/` — `SarfForm`, `SupportCard`, shared `fields`, `FormContext`
- `src/data/sarfOptions.js` — checkbox lists (edit form wording here)
- `src/utils/storage.js` — localStorage helpers (same keys as the old prototype)
- `src/styles/style.css` — original stylesheet + small additions

Prototype only: localStorage is not a secure database, and there is no backend yet.
