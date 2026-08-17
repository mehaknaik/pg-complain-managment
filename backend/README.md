# PG Complaint Management System — Backend

## Setup
```bash
npm install
npm start
# or, for auto-restart on file changes:
npm run dev
```
Server runs at `http://localhost:5000`

## Project Structure
```
pg-complaint-backend/
├── server.js                      # entry point, starts Express app
├── package.json
├── data/
│   └── complaints.js              # in-memory array (acts as the "database")
├── controllers/
│   └── complaintController.js     # all business logic (CRUD, search, filter)
├── middleware/
│   └── validate.js                # form validation before create/update
└── routes/
    └── complaintRoutes.js         # maps URLs -> controller functions
```

## API Endpoints

| Method | Endpoint                        | Purpose                          |
|--------|----------------------------------|-----------------------------------|
| POST   | /api/complaints                 | Create a complaint                |
| GET    | /api/complaints                 | Get all (supports search/filter)  |
| GET    | /api/complaints/:id             | Get one complaint                 |
| PUT    | /api/complaints/:id             | Update complaint details          |
| PATCH  | /api/complaints/:id/status      | Update only the status            |
| DELETE | /api/complaints/:id             | Delete a complaint                |

### Search & Filter (query params on GET /api/complaints)
- `?search=leak` — matches title or description
- `?status=Pending` — filter by status
- `?category=Plumbing` — filter by category
- Combine: `/api/complaints?search=leak&status=Pending`

### Example: create a complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{"title":"Water leakage","description":"Leaking under the kitchen sink","category":"Plumbing"}'
```

### Example: update status
```bash
curl -X PATCH http://localhost:5000/api/complaints/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

## Notes
- Data is **in-memory only** — restarting the server clears all complaints (this matches the "no database" requirement).
- `cors` is enabled so your future frontend (opened via Live Server or similar) can call this API without browser errors.
