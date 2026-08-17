// controllers/complaintController.js
// ---------------------------------------------------
// A "controller" holds the actual logic for what happens
// when a route is hit. The route file just says WHICH URL
// triggers WHICH function — this file says WHAT that
// function actually does.
// ---------------------------------------------------

const { complaints, generateId } = require("../data/complaints");

// ---------------------------------------------------
// CREATE - POST /api/complaints
// ---------------------------------------------------
function createComplaint(req, res) {
  const { title, description, category } = req.body;

  const newComplaint = {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    category: category.trim(),
    status: "Pending", // every new complaint starts as Pending
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  complaints.push(newComplaint);

  res.status(201).json({
    success: true,
    message: "Complaint created successfully.",
    data: newComplaint,
  });
}

// ---------------------------------------------------
// READ ALL (+ search + filter) - GET /api/complaints
// Supports query params:
//   ?search=leak            -> matches title/description
//   ?status=Pending         -> filter by status
//   ?category=Plumbing      -> filter by category
// Example: /api/complaints?search=leak&status=Pending
// ---------------------------------------------------
function getAllComplaints(req, res) {
  const { search, status, category } = req.query;

  // Start with a copy of everything, then narrow it down
  let result = [...complaints];

  if (search) {
    const term = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
    );
  }

  if (status) {
    result = result.filter(
      (c) => c.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (category) {
    result = result.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
}

// ---------------------------------------------------
// READ ONE - GET /api/complaints/:id
// ---------------------------------------------------
function getComplaintById(req, res) {
  const { id } = req.params;
  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found.`,
    });
  }

  res.status(200).json({
    success: true,
    data: complaint,
  });
}

// ---------------------------------------------------
// UPDATE (full edit: title/description/category) - PUT /api/complaints/:id
// ---------------------------------------------------
function updateComplaint(req, res) {
  const { id } = req.params;
  const { title, description, category } = req.body;

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found.`,
    });
  }

  if (title) complaint.title = title.trim();
  if (description) complaint.description = description.trim();
  if (category) complaint.category = category.trim();
  complaint.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "Complaint updated successfully.",
    data: complaint,
  });
}

// ---------------------------------------------------
// UPDATE STATUS ONLY - PATCH /api/complaints/:id/status
// Kept separate from the full update above because in a
// real PG system, changing status (e.g. by an admin/warden)
// is a different action from editing the complaint content.
// ---------------------------------------------------
function updateComplaintStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  const complaint = complaints.find((c) => c.id === id);

  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found.`,
    });
  }

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: `Status updated to "${status}".`,
    data: complaint,
  });
}

// ---------------------------------------------------
// DELETE - DELETE /api/complaints/:id
// ---------------------------------------------------
function deleteComplaint(req, res) {
  const { id } = req.params;
  const index = complaints.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found.`,
    });
  }

  const deleted = complaints.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Complaint deleted successfully.",
    data: deleted,
  });
}

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};
