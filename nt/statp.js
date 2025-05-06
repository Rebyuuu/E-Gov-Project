document.getElementById('status-check-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
  
    const refNumber = document.getElementById('refNumber').value;
    const statusResult = document.getElementById('status-result');
  
    try {
      // Fetch the status from the server
      const response = await fetch(`http://localhost/nt/statpag.php?refNumber=${refNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch status');
      }
  
      const data = await response.json();
      if (data.success) {
        // Display the status and details
        statusResult.innerHTML = `
          <p>Application Status: <span class="status-${data.status.toLowerCase()}">${data.status}</span></p>
          <p>Details: ${data.details || 'No additional details available.'}</p>
        `;
        statusResult.style.display = 'block';
      } else {
        throw new Error(data.message || 'Failed to fetch status');
      }
    } catch (error) {
      // Display an error message
      statusResult.innerHTML = `<p style="color: #dc3545;">Error: ${error.message}</p>`;
      statusResult.style.display = 'block';
    }
  });