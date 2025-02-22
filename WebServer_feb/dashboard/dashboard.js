document.addEventListener("DOMContentLoaded", async () => {
    const { data: user, error } = await supabase.auth.getUser();

    if (!user || error) {
        window.location.href = "WebServer_feb/login/Login.html"; // Redirect if not logged in
    } else {
        document.getElementById("userEmail").textContent = `Logged in as: ${user.email}`;
    }
});

// Logout function
document.getElementById("logoutBtn").addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "WebServer_feb/Login.html"; // Redirect to login page
});
