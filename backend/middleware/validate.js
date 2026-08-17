// middleware/validate.js
// ---------------------------------------------------
// Middleware = a function that runs BEFORE the actual
// route handler. It checks the incoming data and either:
//   - stops the request and sends an error response, OR
//   - calls next() to let the request continue.
// ---------------------------------------------------

const ALLOWED_STATUSES = ["Pending", "In Progress", "Resolved"];

// Used when CREATING a complaint (POST /api/complaints)
function validateComplaint(req, res, next) {
  const { title, description, category } = req.body;
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push("Title is required and must be at least 3 characters.");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Description is required and must be at least 10 characters.");
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is required.");
  }

  // If there are any errors, stop here and respond with 400 (Bad Request)
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  // No errors -> move on to the actual controller function
  next();
}

// Used when UPDATING ONLY THE STATUS (PATCH /api/complaints/:id/status)
function validateStatus(req, res, next) {
  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
    });
  }

  next();
}

module.exports = {
  validateComplaint,
  validateStatus,
  ALLOWED_STATUSES,
};
