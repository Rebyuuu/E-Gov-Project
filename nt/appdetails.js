document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
    const refNumber = urlParams.get("refNumber");
  
    if (!refNumber) {
      alert("No reference number provided.");
      window.location.href = "admin.html"; // Redirect back to the admin page
      return;
    }
  
    // Fetch application details
    async function fetchApplicationDetails() {
      try {
        const response = await fetch(`http://localhost/nt/appdetails.php?refNumber=${refNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }
  
        const data = await response.json();
        if (data.success) {
          populateApplicationDetails(data.application);
        } else {
          throw new Error(data.message || "Failed to fetch application details");
        }
      } catch (error) {
        console.error("Error fetching application details:", error);
        alert(`Error: ${error.message}`);
      }
    }
  function populateApplicationDetails(application) {
    // ref Number
    document.querySelector("#sim-number").textContent = application.refrence_no;
    document.querySelector("#sim-number").textContent = application.sim_number;

    // New Owner's Photo
    const newPhotoImg = document.getElementById("new-photo-img");
    newPhotoImg.src = application.new_photo;

   // Current Owner Details
   document.getElementById("current-name").value = application.current_name;
   document.getElementById("current-name-nepali").value = application.current_name_nepali;
   document.getElementById("current-father").value = application.current_father;
   document.getElementById("current-mother").value = application.current_mother;
   document.getElementById("current-citizenship-no").value = application.current_citizenship_no;
   document.getElementById("current-citizenship-district").value = application.current_citizenship_district;
   document.getElementById("current-citizenship-date").value = application.current_citizenship_date;
   document.getElementById("current-phone").value = application.current_phone;
   document.getElementById("current-email").value = application.current_email;
   document.getElementById("current-province").value = application.current_province;
   document.getElementById("current-district").value = application.current_district;
   document.getElementById("current-municipality").value = application.current_municipality;
   document.getElementById("current-ward").value = application.current_ward;
   document.getElementById("current-citizenship-front-link").href = application.current_citizenship_front;
   document.getElementById("current-citizenship-back-link").href = application.current_citizenship_back;

   // New Owner Details
   document.getElementById("new-name").value = application.new_name;
   document.getElementById("new-name-nepali").value = application.new_name_nepali;
   document.getElementById("new-father").value = application.new_father;
   document.getElementById("new-mother").value = application.new_mother;
   document.getElementById("new-citizenship-no").value = application.new_citizenship_no;
   document.getElementById("new-citizenship-district").value = application.new_citizenship_district;
   document.getElementById("new-citizenship-date").value = application.new_citizenship_date;
   document.getElementById("new-phone").value = application.new_phone;
   document.getElementById("new-email").value = application.new_email;
   document.getElementById("new-province").value = application.new_province;
   document.getElementById("new-district").value = application.new_district;
   document.getElementById("new-municipality").value = application.new_municipality;
   document.getElementById("new-ward").value = application.new_ward;
   document.getElementById("new-citizenship-front-link").href = application.new_citizenship_front;
   document.getElementById("new-citizenship-back-link").href = application.new_citizenship_back;
   document.getElementById("terms").checked = true;
 }

 // get the  application details when the page load(fetching)
 fetchApplicationDetails();
});