document.addEventListener("DOMContentLoaded", function () {
    const applicationsTable = document.getElementById("applications-table");
    // Fetch all applications from the server
    async function fetchApplications() {
      try {
        const response = await fetch("http://localhost/nt/admin.php");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
  
        const data = await response.json();
        if (data.success) {
          populateApplicationsTable(data.applications);
        } else {
          throw new Error(data.message || "Failed to fetch applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        alert(`Error: ${error.message}`);
      }
    }
  
    // Populate the applications table
    function populateApplicationsTable(applications) {
      const tbody = applicationsTable.querySelector("tbody");
      tbody.innerHTML = ""; // Clear existing rows
  
      applications.forEach((app) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${app.refrence_no}</td>
          <td>${app.sim_number}</td>
          <td>${app.current_name}</td>
          <td>${app.new_name}</td>
          <td>${app.status}</td>
          <td>
            <button class="approve-button" data-ref="${app.refrence_no}">Approve</button>
            <button class="reject-button" data-ref="${app.refrence_no}">Reject</button>
            <a href="appdetails.html?refNumber=${app.refrence_no}" class="view-details-button">View Details</a>
          </td>
        `;
        tbody.appendChild(row);
      });
      // Add event listeners to Approve and Reject buttons
      const approveButtons = document.querySelectorAll(".approve-button");
      const rejectButtons = document.querySelectorAll(".reject-button");
  
      approveButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const refNumber = e.target.getAttribute("data-ref");
          updateStatus(refNumber, "Approved");
        });
      });
  
      rejectButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const refNumber = e.target.getAttribute("data-ref");
          updateStatus(refNumber, "Rejected");
        });
      });
    }
  
    // Update the status of an application
    async function updateStatus(refNumber, status) {
      const details = prompt(`Enter details for ${status.toLowerCase()} status:`);
      if (details === null) return; // User clicked "Cancel"
  
      try {
        const response = await fetch("http://localhost/nt/updatestatus.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refNumber,
            status,
            details,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
  
        const data = await response.json();
        if (data.success) {
          alert("Status updated successfully!");
          fetchApplications(); // Refresh the applications table
        } else {
          throw new Error(data.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert(`Error: ${error.message}`);
      }
    }
  
    // Fetch applications when the page loads
    fetchApplications();
  });