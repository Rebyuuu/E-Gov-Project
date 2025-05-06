document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("sim-transfer-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form before submitting
        if (validateForm()) {
            const formData = new FormData(form);

            // Debugging: Log form data
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            // Send form data using Fetch API
    //         fetch("http://localhost/nt/submitform.php", {
    //             method: "POST",
    //             body: formData,
    //         })
    //         .then(async response => {
    //             const text = await response.text(); // Read raw text
    //             console.log("Raw response:", text); // Debugging: Log raw response
    //             try {
    //                 return JSON.parse(text); // Try parsing JSON
    //             } catch (error) {
    //                 throw new Error("Invalid JSON response: " + text); // Handle non-JSON response
    //             }
    //         })
    //          .then(data => {
    //              if (data.success) {
    //                 window.location.href = `success.html?refNumber=${result.refrence_no}`;
    //         //         alert(data.message);
    //         //         form.reset();
    //              } else {
    //                  alert("Error: " + data.message);
    //              }
    //         })
    //         .catch(error => {
    //             console.error("Error submitting form: ", error);
    //             alert("An error occurred while submitting the form: " + error.message);
    //         });
      }
     });

    function validateForm() {
        let isValid = true;

        // Validate SIM Number
        const simNumber = document.getElementById("sim-number").value;
        if (!/^(98|97)\d{8}$/.test(simNumber)) {
            isValid = false;
            alert("SIM Number must be 10 digits starting with 98 or 97.");
        }

        // Validate Current Phone Number
        const currentPhone = document.getElementById("current-phone").value;
        if (!/^(98|97)\d{8}$/.test(currentPhone)) {
            isValid = false;
            alert("Current Phone Number must be 10 digits starting with 98 or 97.");
        }

        // Validate New Phone Number
        const newPhone = document.getElementById("new-phone").value;
        if (!/^(98|97)\d{8}$/.test(newPhone)) {
            isValid = false;
            alert("New Phone Number must be 10 digits starting with 98 or 97.");
        }

        // Validate Email Address (both Current and New Owner)
        const currentEmail = document.getElementById("current-email").value;
        const newEmail = document.getElementById("new-email").value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(currentEmail)) {
            isValid = false;
            alert("Please enter a valid email address for the current owner.");
        }

        if (!emailPattern.test(newEmail)) {
            isValid = false;
            alert("Please enter a valid email address for the new owner.");
        }

        // Validate if all required files are selected
        const currentCitizenshipFront = document.getElementById("current-citizenship-front").files[0];
        const currentCitizenshipBack = document.getElementById("current-citizenship-back").files[0];
        const currentPhoto = document.getElementById("current-photo").files[0];

        const newCitizenshipFront = document.getElementById("new-citizenship-front").files[0];
        const newCitizenshipBack = document.getElementById("new-citizenship-back").files[0];
        const newPhoto = document.getElementById("new-photo").files[0];

        if (!currentCitizenshipFront || !currentCitizenshipBack || !currentPhoto) {
            isValid = false;
            alert("Please upload all required documents for the current owner.");
        }

        if (!newCitizenshipFront || !newCitizenshipBack || !newPhoto) {
            isValid = false;
            alert("Please upload all required documents for the new owner.");
        }

        // Validate checkbox
        const termsCheckbox = document.getElementById("terms");
        if (!termsCheckbox.checked) {
            isValid = false;
            alert("You must agree to the terms and conditions.");
        }

        return isValid;
    }
});
// Form submission handler
document.getElementById('sim-transfer-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const url = 'http://localhost/nt/submitform.php';
        const response = await fetch(url, {
            method: 'POST',
            body: new FormData(e.target)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Submission failed');
        }

        const result = await response.json();
        if (result.success) {
            // Redirect to the success page with the refNumber in the URL
            window.location.href = `success.html?refNumber=${result.refrence_no}`;
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert(`Error: ${error.message}`);
    }
});
