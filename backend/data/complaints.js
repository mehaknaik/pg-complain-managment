// data/complaints.js
// ---------------------------------------------------
// This file is our "fake database". Since the project
// requirement says "no database", we just keep an
// array in memory. As long as the server keeps running,
// the data stays. If you restart the server, it resets.
// ---------------------------------------------------

// Every complaint object will look like this:
// {
//   id: "1",
//   title: "Water leakage in kitchen",
//   description: "Water has been leaking under the sink for 3 days",
//   category: "Plumbing",
//   status: "Pending",       // Pending | In Progress | Resolved
//   createdAt: "2026-08-17T10:00:00.000Z",
//   updatedAt: "2026-08-17T10:00:00.000Z"
// }

let complaints = []; // the actual in-memory "table"
let nextId = 1;      // simple auto-increment counter for IDs

// Generates the next unique ID and increments the counter.
function generateId() {
  const id = String(nextId);
  nextId += 1;
  return id;
}

// Exporting the array itself AND a function to create IDs,
// so the controller file can read/write to the same array.
module.exports = {
  complaints,
  generateId,
};
