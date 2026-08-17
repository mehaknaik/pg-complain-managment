// server.js
// ---------------------------------------------------
// This is the entry point of the backend. Running
// `node server.js` starts everything.
// ---------------------------------------------------

const express = require("express");
const cors = require("cors");

const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ----------------
// Allows the frontend (running on a different port/origin,
// e.g. http://127.0.0.1:5500) to call this API without
// being blocked by the browser's CORS policy.
app.use(cors());

// Lets Express automatically parse incoming JSON request
// bodies into req.body (needed for POST/PUT/PATCH).
app.use(express.json());

// ---------------- ROUTES ----------------
// Simple health-check route to confirm the server is alive.
app.get("/", (req, res) => {
  res.json({ message: "PG Complaint Management System API is running." });
});

// Every route inside complaintRoutes.js will be prefixed
// with /api/complaints. E.g. router.get("/") becomes
// GET /api/complaints
app.use("/api/complaints", complaintRoutes);

// ---------------- 404 HANDLER ----------------
// Runs only if no route above matched the request.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ---------------- GLOBAL ERROR HANDLER ----------------
// Catches any unexpected errors thrown in route handlers
// so the server doesn't crash and the client gets a clean
// error response instead.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
