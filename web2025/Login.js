document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  // Basic validation (replace with real validation in production)
  if (username === "admin" && password === "1234") {
    errorMessage.style.display = "none";
    // Redirect to the main website
    window.location.href = "index.html"; // Path to your main website
} else {
    errorMessage.textContent = "Invalid username or password.";
    errorMessage.style.display = "block";
}
});
