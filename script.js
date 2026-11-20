// Button Messages
function showMessage(type) {
    if (type === "Lost") {
        alert("You selected Report Lost Item!");
    } else if (type === "Found") {
        alert("You selected Report Found Item!");
    }
}

// Beautiful Success Message
function showSuccessMessage(type) {
    const message = document.createElement("div");
    message.className = "success-message";

    const heading = document.createElement("h3");
    heading.textContent = "✓ Report Submitted!";

    const description = document.createElement("p");
    description.textContent =
        type === "Lost"
        ? "Your lost item report has been submitted successfully."
        : "Your found item report has been submitted successfully.";

    message.appendChild(heading);
    message.appendChild(description);

    document.body.appendChild(message);

    setTimeout(function () {
        message.remove();
    }, 4000);
}

// Lost Item Form
document.getElementById("lostForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const report = {
        type: "Lost",
        name: document.getElementById("lostName").value,
        item: document.getElementById("lostItem").value,
        category: document.getElementById("lostCategory").value,
        date: document.getElementById("lostDate").value,
        location: document.getElementById("lostLocation").value,
        description: document.getElementById("lostDescription").value,
        email: document.getElementById("lostEmail").value
    };

    let reports = JSON.parse(localStorage.getItem("reports")) || [];
    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));
    displayReports();
    updateDashboard();

    showSuccessMessage("Lost");
    document.getElementById("lostForm").reset();
});

// Found Item Form
document.getElementById("foundForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const imageFile = document.getElementById("foundImage").files[0];

    if (imageFile && imageFile.size > 1024 * 1024) {
        alert("Please select an image smaller than 1 MB.");
        return;
    }

    function saveFoundReport(imageData) {
        const report = {
            type: "Found",
            name: document.getElementById("foundName").value,
            item: document.getElementById("foundItem").value,
            category: document.getElementById("foundCategory").value,
            date: document.getElementById("foundDate").value,
            location: document.getElementById("foundLocation").value,
            description: document.getElementById("foundDescription").value,
            email: document.getElementById("foundEmail").value,
            image: imageData
        };

        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push(report);
        localStorage.setItem("reports", JSON.stringify(reports));

        displayReports();
        updateDashboard();
        showSuccessMessage("Found");
        document.getElementById("foundForm").reset();
    }

    if (imageFile) {
        const reader = new FileReader();

        reader.onload = function() {
            saveFoundReport(reader.result);
        };

        reader.readAsDataURL(imageFile);
    } else {
        saveFoundReport("");
    }
});
// Update Dashboard Numbers
function updateDashboard() {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    const total = reports.length;
    const lost = reports.filter(report => report.type === "Lost").length;
    const found = reports.filter(report => report.type === "Found").length;
    const resolved = reports.filter(report => report.status === "Resolved").length;

    document.getElementById("totalReports").textContent = total;
    document.getElementById("lostCount").textContent = lost;
    document.getElementById("foundCount").textContent = found;
    document.getElementById("resolvedCount").textContent = resolved;
}
// Display Recently Reported Items
function displayReports() {
    const reportsList = document.getElementById("reportsList");
    const reports = JSON.parse(localStorage.getItem("reports")) || [];
    const searchText = document.getElementById("searchInput").value.toLowerCase();
const filterType = document.getElementById("filterType").value;

const filteredReports = reports
    .map(function(report, index) {
        return { report: report, index: index };
    })
    .filter(function(entry) {
        const report = entry.report;

        const matchesSearch =
            report.item.toLowerCase().includes(searchText) ||
            report.category.toLowerCase().includes(searchText);

        const matchesType =
            filterType === "All" || report.type === filterType;

        return matchesSearch && matchesType;
    });

    reportsList.textContent = "";

    if (filteredReports.length === 0) {
    reportsList.textContent = reports.length === 0
        ? "No reports yet."
        : "No matching reports found.";
    return;
}

    for (let i = filteredReports.length - 1; i >= 0; i--) {
    const report = filteredReports[i].report;
    const originalIndex = filteredReports[i].index;

        const card = document.createElement("div");
        card.className = "report-card";
if (report.image) {
    const image = document.createElement("img");
    image.src = report.image;
    image.alt = "Photo of " + report.item;
    image.className = "report-image";
    card.appendChild(image);
}
        const heading = document.createElement("h3");
        heading.textContent = report.item + " (" + report.type + ")";

        const category = document.createElement("p");
        category.textContent = "Category: " + report.category;

        const date = document.createElement("p");
        date.textContent = "Date: " + report.date;

        const location = document.createElement("p");
        location.textContent = "Location: " + report.location;

        const description = document.createElement("p");
        description.textContent = "Description: " + report.description;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Report";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            if (confirm("Are you sure you want to delete this report?")) {
                const updatedReports =
                    JSON.parse(localStorage.getItem("reports")) || [];

                updatedReports.splice(originalIndex, 1);

                localStorage.setItem(
                    "reports",
                    JSON.stringify(updatedReports)
                );

                displayReports();
                updateDashboard();
            }
        });

        card.appendChild(heading);
        card.appendChild(category);
        card.appendChild(date);
        card.appendChild(location);
        card.appendChild(description);
        card.appendChild(deleteButton);

        reportsList.appendChild(card);
    }
}
// Search and Filter Events
document.getElementById("searchInput").addEventListener("input", displayReports);

document.getElementById("filterType").addEventListener("change", displayReports);
// Open Main Page
function openMainPage() {
    document.getElementById("welcomeScreen").style.display = "none";
}
// Get Started Button
document.getElementById("getStartedBtn").addEventListener("click", function() {
    document.getElementById("welcomeScreen").style.display = "none";
});
// Load Reports and Dashboard
displayReports();
updateDashboard();
