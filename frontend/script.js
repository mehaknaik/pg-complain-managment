// ======================================================
// PG COMPLAINT MANAGEMENT SYSTEM
// Frontend JavaScript
// ======================================================


// ======================================================
// 1. BACKEND API URL
// ======================================================

// Change this if your backend uses a different port.

const API_URL = "http://localhost:5000/api/complaints";


// ======================================================
// 2. GET HTML ELEMENTS
// ======================================================

const complaintForm =
    document.getElementById("complaintForm");

const complaintsContainer =
    document.getElementById("complaintsContainer");

const message =
    document.getElementById("message");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const statusFilter =
    document.getElementById("statusFilter");


// Form fields

const residentName =
    document.getElementById("residentName");

const roomNumber =
    document.getElementById("roomNumber");

const contact =
    document.getElementById("contact");

const category =
    document.getElementById("category");

const priority =
    document.getElementById("priority");

const description =
    document.getElementById("description");

const complaintId =
    document.getElementById("complaintId");

const submitBtn =
    document.getElementById("submitBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// ======================================================
// 3. STORE COMPLAINTS
// ======================================================

let complaints = [];


// ======================================================
// 4. LOAD COMPLAINTS WHEN PAGE OPENS
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    loadComplaints();

});


// ======================================================
// 5. GET ALL COMPLAINTS
// ======================================================

// API:
// GET /api/complaints

async function loadComplaints() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                "Unable to load complaints"
            );

        }

        const data = await response.json();

        complaints = data.data;

        displayComplaints(complaints);

        updateStatistics();

    } catch (error) {

        console.error(error);

        showMessage(
            "Error loading complaints. Make sure the backend server is running.",
            "error"
        );

    }

}


// ======================================================
// 6. DISPLAY COMPLAINTS
// ======================================================

function displayComplaints(data) {

    complaintsContainer.innerHTML = "";


    if (data.length === 0) {

        complaintsContainer.innerHTML = `
            <div class="empty">
                <h3>No complaints found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        return;

    }


    data.forEach(complaint => {

        const card =
            document.createElement("div");

        card.className = "complaint-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(
                    complaint.category || "Complaint"
                )}
            </h3>

            <p>
                <strong>Resident:</strong>
                ${escapeHTML(
                    complaint.residentName || "-"
                )}
            </p>

            <p>
                <strong>Room:</strong>
                ${escapeHTML(
                    complaint.roomNumber ||
                    complaint.room ||
                    complaint.flatNumber ||
                    "-"
                )}
            </p>

            <p>
                <strong>Priority:</strong>

                <span class="badge
                    priority-${getPriorityClass(
                        complaint.priority
                    )}">
                    ${escapeHTML(
                        complaint.priority || "-"
                    )}
                </span>

            </p>

            <p>
                <strong>Status:</strong>

                <span class="badge
                    ${getStatusClass(
                        complaint.status
                    )}">
                    ${escapeHTML(
                        complaint.status || "Pending"
                    )}
                </span>

            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(
                    complaint.description || "-"
                )}
            </p>


            <div class="card-buttons">

                <button
                    class="view-btn"
                    onclick="viewComplaint('${complaint.id}')"
                >
                    View
                </button>

                <button
                    class="edit-btn"
                    onclick="editComplaint('${complaint.id}')"
                >
                    Edit
                </button>

                <button
                    class="status-btn"
                    onclick="changeStatus('${complaint.id}')"
                >
                    Status
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteComplaint('${complaint.id}')"
                >
                    Delete
                </button>

            </div>

        `;


        complaintsContainer.appendChild(card);

    });

}


// ======================================================
// 7. CREATE COMPLAINT
// ======================================================

// API:
// POST /api/complaints

complaintForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Validate form

        if (!validateForm()) {

            return;

        }


        const complaintData = {
            title:
                category.value.trim() + " Complaint",

            residentName:
                residentName.value.trim(),

            roomNumber:
                roomNumber.value.trim(),

            contact:
                contact.value.trim(),

            category:
                category.value,

            priority:
                priority.value,

            description:
                description.value.trim(),

            status: "Pending",

            date:
                new Date().toISOString()

        };


        try {

            let response;


            // ==================================================
            // UPDATE
            // ==================================================

            if (complaintId.value) {

                // PUT /api/complaints/:id

                response = await fetch(
                    `${API_URL}/${complaintId.value}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                complaintData
                            )
                    }
                );


            }

            // ==================================================
            // CREATE
            // ==================================================

            else {

                // POST /api/complaints

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                complaintData
                            )
                    }
                );

            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Something went wrong"
                );

            }


            if (complaintId.value) {

                showMessage(
                    "Complaint updated successfully!",
                    "success"
                );

            } else {

                showMessage(
                    "Complaint submitted successfully!",
                    "success"
                );

            }


            resetForm();

            await loadComplaints();


            // Scroll to complaints

            document
                .getElementById("complaints")
                .scrollIntoView({
                    behavior: "smooth"
                });


        } catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Unable to save complaint",
                "error"
            );

        }

    }
);


// ======================================================
// 8. VIEW INDIVIDUAL COMPLAINT
// ======================================================

// API:
// GET /api/complaints/:id

async function viewComplaint(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Complaint not found"
            );

        }


        const complaint =
            await response.json();


        alert(

            `Complaint Details\n\n` +

            `Resident: ${
                complaint.residentName || "-"
            }\n` +

            `Room: ${
                complaint.roomNumber ||
                complaint.room ||
                "-"
            }\n` +

            `Contact: ${
                complaint.contact || "-"
            }\n` +

            `Category: ${
                complaint.category || "-"
            }\n` +

            `Priority: ${
                complaint.priority || "-"
            }\n` +

            `Status: ${
                complaint.status || "-"
            }\n\n` +

            `Description:\n${
                complaint.description || "-"
            }`

        );


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// 9. EDIT COMPLAINT
// ======================================================

// First GET:
// GET /api/complaints/:id

// Then PUT:
// PUT /api/complaints/:id

async function editComplaint(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`
        );


        if (!response.ok) {

            throw new Error(
                "Unable to find complaint"
            );

        }


        const complaint =
            await response.json();


        complaintId.value =
            complaint.id;


        residentName.value =
            complaint.residentName || "";


        roomNumber.value =
            complaint.roomNumber ||
            complaint.room ||
            complaint.flatNumber ||
            "";


        contact.value =
            complaint.contact || "";


        category.value =
            complaint.category || "";


        priority.value =
            complaint.priority || "";


        description.value =
            complaint.description || "";


        submitBtn.textContent =
            "Update Complaint";


        cancelEditBtn.style.display =
            "inline-block";


        document
            .getElementById("addComplaint")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// 10. DELETE COMPLAINT
// ======================================================

// API:
// DELETE /api/complaints/:id

async function deleteComplaint(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this complaint?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete complaint"
            );

        }


        showMessage(
            "Complaint deleted successfully!",
            "success"
        );


        await loadComplaints();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// 11. UPDATE STATUS
// ======================================================

async function changeStatus(id) {

    const newStatus =
        prompt(
            "Enter status:\n\n" +
            "Pending\n" +
            "In Progress\n" +
            "Resolved"
        );


    if (!newStatus) {

        return;

    }


    const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved"
    ];


    if (!allowedStatuses.includes(newStatus)) {

        showMessage(
            "Invalid status. Use Pending, In Progress, or Resolved.",
            "error"
        );

        return;

    }


    try {

        // PUT /api/complaints/:id

        const response = await fetch(
            `${API_URL}/${id}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: newStatus
                })
            }
        );  


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update status"
            );

        }


        showMessage(
            "Complaint status updated successfully!",
            "success"
        );


        await loadComplaints();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


// ======================================================
// 12. SEARCH + FILTER
// ======================================================

searchInput.addEventListener(
    "input",
    applyFilters
);

categoryFilter.addEventListener(
    "change",
    applyFilters
);

priorityFilter.addEventListener(
    "change",
    applyFilters
);

statusFilter.addEventListener(
    "change",
    applyFilters
);


function applyFilters() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    const selectedPriority =
        priorityFilter.value;


    const selectedStatus =
        statusFilter.value;


    const filtered =
        complaints.filter(complaint => {


            const searchText = `

                ${complaint.residentName || ""}

                ${complaint.roomNumber || ""}

                ${complaint.category || ""}

                ${complaint.description || ""}

                ${complaint.contact || ""}

            `.toLowerCase();


            const matchesSearch =
                searchText.includes(search);


            const matchesCategory =
                !selectedCategory ||
                complaint.category ===
                selectedCategory;


            const matchesPriority =
                !selectedPriority ||
                complaint.priority ===
                selectedPriority;


            const matchesStatus =
                !selectedStatus ||
                complaint.status ===
                selectedStatus;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPriority &&
                matchesStatus
            );

        });


    displayComplaints(filtered);

}


// ======================================================
// 13. FORM VALIDATION
// ======================================================

function validateForm() {

    const name =
        residentName.value.trim();

    const room =
        roomNumber.value.trim();

    const phone =
        contact.value.trim();

    const selectedCategory =
        category.value;

    const selectedPriority =
        priority.value;

    const desc =
        description.value.trim();


    if (name.length < 2) {

        showMessage(
            "Resident name must contain at least 2 characters.",
            "error"
        );

        return false;

    }


    if (room === "") {

        showMessage(
            "Please enter room/flat number.",
            "error"
        );

        return false;

    }


    if (!/^[0-9]{10}$/.test(phone)) {

        showMessage(
            "Please enter a valid 10 digit contact number.",
            "error"
        );

        return false;

    }


    if (selectedCategory === "") {

        showMessage(
            "Please select a complaint category.",
            "error"
        );

        return false;

    }


    if (selectedPriority === "") {

        showMessage(
            "Please select complaint priority.",
            "error"
        );

        return false;

    }


    if (desc.length < 10) {

        showMessage(
            "Complaint description must contain at least 10 characters.",
            "error"
        );

        return false;

    }


    return true;

}


// ======================================================
// 14. RESET FORM
// ======================================================

function resetForm() {

    complaintForm.reset();


    complaintId.value = "";


    submitBtn.textContent =
        "Submit Complaint";


    cancelEditBtn.style.display =
        "none";

}


// ======================================================
// 15. SHOW SUCCESS / ERROR MESSAGE
// ======================================================

function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `message ${type}`;


    setTimeout(() => {

        message.className =
            "message";

    }, 4000);

}


// ======================================================
// 16. UPDATE STATISTICS
// ======================================================

function updateStatistics() {

    document.getElementById(
        "totalComplaints"
    ).textContent =
        complaints.length;


    const pending =
        complaints.filter(
            complaint =>
                complaint.status === "Pending"
        ).length;


    const progress =
        complaints.filter(
            complaint =>
                complaint.status === "In Progress"
        ).length;


    const resolved =
        complaints.filter(
            complaint =>
                complaint.status === "Resolved"
        ).length;


    document.getElementById(
        "pendingComplaints"
    ).textContent =
        pending;


    document.getElementById(
        "progressComplaints"
    ).textContent =
        progress;


    document.getElementById(
        "resolvedComplaints"
    ).textContent =
        resolved;

}


// ======================================================
// 17. STATUS CSS CLASS
// ======================================================

function getStatusClass(status) {

    if (status === "Resolved") {

        return "status-resolved";

    }


    if (status === "In Progress") {

        return "status-progress";

    }


    return "status-pending";

}


// ======================================================
// 18. PRIORITY CSS CLASS
// ======================================================

function getPriorityClass(priority) {

    if (!priority) {

        return "low";

    }


    return priority.toLowerCase();

}


// ======================================================
// 19. BASIC HTML ESCAPING
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

}