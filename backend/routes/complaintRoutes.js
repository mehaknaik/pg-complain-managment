// routes/complaintRoutes.js
// ---------------------------------------------------
// This file only defines WHICH URL + HTTP method maps to
// WHICH controller function. No actual logic lives here —
// that keeps things organized as the app grows.
// ---------------------------------------------------

const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");

const { validateComplaint, validateStatus } = require("../middleware/validate");

// POST   /api/complaints          -> create a new complaint
router.post("/", validateComplaint, createComplaint);

// GET    /api/complaints          -> get all (supports ?search & ?status & ?category)
router.get("/", getAllComplaints);

// GET    /api/complaints/:id      -> get a single complaint
router.get("/:id", getComplaintById);

// PUT    /api/complaints/:id      -> full update of a complaint
router.put("/:id", validateComplaint, updateComplaint);

// PATCH  /api/complaints/:id/status -> update ONLY the status
router.patch("/:id/status", validateStatus, updateComplaintStatus);

// DELETE /api/complaints/:id      -> delete a complaint
router.delete("/:id", deleteComplaint);

module.exports = router;
