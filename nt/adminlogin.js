document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const validAdmins = {
        'ntc01': 'nepal@123',
        'ntc02': 'nepal@321'
    };

    if (validAdmins[adminId] && validAdmins[adminId] === password) {
        //correct credentials then
        window.location.href = 'admin.html';
    } else {
        errorMessage.textContent = 'Invalid Admin ID or Password';
        errorMessage.style.display = 'block';
    }
});