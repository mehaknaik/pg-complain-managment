// controllers/complaintController.js
// ---------------------------------------------------
// Controller contains the actual logic for each API.
// ---------------------------------------------------

const { complaints, generateId } = require("../data/complaints");

// ===================================================
// CREATE COMPLAINT
// POST /api/complaints
// ===================================================

function createComplaint(req, res) {
  const {
    title,
    residentName,
    roomNumber,
    contact,
    description,
    category,
    priority,
  } = req.body;

  const newComplaint = {
    id: generateId(),

    title: title.trim(),

    residentName: residentName ? residentName.trim() : "",

    roomNumber: roomNumber ? roomNumber.trim() : "",

    contact: contact ? contact.trim() : "",

    description: description.trim(),

    category: category.trim(),

    priority: priority || "Low",

    // Every new complaint starts as Pending
    status: "Pending",

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


// ===================================================
// GET ALL COMPLAINTS
// GET /api/complaints
//
// Supports:
// ?search=fan
// ?status=Pending
// ?category=Electricity
// ===================================================

function getAllComplaints(req, res) {
  const {
    search,
    status,
    category,
  } = req.query;

  // Start with all complaints
  let result = [...complaints];


  // -------------------------------------------------
  // SEARCH
  // -------------------------------------------------

  if (search) {
    const term = search.toLowerCase().trim();

    result = result.filter((c) => {

      return (

        (c.title || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.description || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.residentName || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.roomNumber || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.contact || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.category || "")
          .toLowerCase()
          .includes(term)

        ||

        (c.priority || "")
          .toLowerCase()
          .includes(term)

      );

    });
  }


  // -------------------------------------------------
  // FILTER BY STATUS
  // -------------------------------------------------

  if (status) {

    result = result.filter(
      (c) =>
        (c.status || "")
          .toLowerCase() ===
        status.toLowerCase()
    );

  }


  // -------------------------------------------------
  // FILTER BY CATEGORY
  // -------------------------------------------------

  if (category) {

    result = result.filter(
      (c) =>
        (c.category || "")
          .toLowerCase() ===
        category.toLowerCase()
    );

  }


  // -------------------------------------------------
  // SEND RESPONSE
  // -------------------------------------------------

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
}


// ===================================================
// GET ONE COMPLAINT
// GET /api/complaints/:id
// ===================================================

function getComplaintById(req, res) {

  const { id } = req.params;

  const complaint =
    complaints.find(
      (c) => c.id === id
    );


  // Complaint not found
  if (!complaint) {

    return res.status(404).json({

      success: false,

      message:
        `Complaint with id ${id} not found.`,

    });

  }


  // Complaint found
  res.status(200).json({

    success: true,

    data: complaint,

  });

}


// ===================================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// ===================================================

function updateComplaint(req, res) {

  const { id } = req.params;

  const {
    title,
    residentName,
    roomNumber,
    contact,
    description,
    category,
    priority,
  } = req.body;


  const complaint =
    complaints.find(
      (c) => c.id === id
    );


  // Complaint not found
  if (!complaint) {

    return res.status(404).json({

      success: false,

      message:
        `Complaint with id ${id} not found.`,

    });

  }


  // -------------------------------------------------
  // UPDATE FIELDS
  // -------------------------------------------------

  if (title) {

    complaint.title =
      title.trim();

  }


  if (residentName) {

    complaint.residentName =
      residentName.trim();

  }


  if (roomNumber) {

    complaint.roomNumber =
      roomNumber.trim();

  }


  if (contact) {

    complaint.contact =
      contact.trim();

  }


  if (description) {

    complaint.description =
      description.trim();

  }


  if (category) {

    complaint.category =
      category.trim();

  }


  if (priority) {

    complaint.priority =
      priority;

  }


  // Update timestamp
  complaint.updatedAt =
    new Date().toISOString();


  // -------------------------------------------------
  // SEND RESPONSE
  // -------------------------------------------------

  res.status(200).json({

    success: true,

    message:
      "Complaint updated successfully.",

    data: complaint,

  });

}


// ===================================================
// UPDATE STATUS
// PATCH /api/complaints/:id/status
// ===================================================

function updateComplaintStatus(req, res) {

  const { id } = req.params;

  const { status } = req.body;


  const complaint =
    complaints.find(
      (c) => c.id === id
    );


  // Complaint not found
  if (!complaint) {

    return res.status(404).json({

      success: false,

      message:
        `Complaint with id ${id} not found.`,

    });

  }


  // Update status
  complaint.status =
    status;


  // Update timestamp
  complaint.updatedAt =
    new Date().toISOString();


  res.status(200).json({

    success: true,

    message:
      `Status updated to "${status}".`,

    data: complaint,

  });

}


// ===================================================
// DELETE COMPLAINT
// DELETE /api/complaints/:id
// ===================================================

function deleteComplaint(req, res) {

  const { id } = req.params;


  const index =
    complaints.findIndex(
      (c) => c.id === id
    );


  // Complaint not found
  if (index === -1) {

    return res.status(404).json({

      success: false,

      message:
        `Complaint with id ${id} not found.`,

    });

  }


  // Remove complaint
  const deleted =
    complaints.splice(
      index,
      1
    )[0];


  res.status(200).json({

    success: true,

    message:
      "Complaint deleted successfully.",

    data: deleted,

  });

}


// ===================================================
// EXPORT CONTROLLERS
// ===================================================

module.exports = {

  createComplaint,

  getAllComplaints,

  getComplaintById,

  updateComplaint,

  updateComplaintStatus,

  deleteComplaint,

};