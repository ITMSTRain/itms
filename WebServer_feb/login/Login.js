// Ensure Supabase is loaded first
document.addEventListener("DOMContentLoaded", async () => {
    // Initialize Supabase
    const SUPABASE_URL = "https://wcdscmlpgtstfwuagutt.supabase.co";  // Replace with your Supabase URL
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHNjbWxwZ3RzdGZ3dWFndXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMjE2NDAsImV4cCI6MjA1MzY5NzY0MH0.BrYUgkRLDsx0lOccC0x2IlNsi0RzoMDgu0SfgJCCuwI";  // Replace with your Supabase Anon Key

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    console.log("Supabase Initialized:", supabase); // Debugging output

    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevent default form submission

        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("errorMessage");

        try {
            // Authenticate user with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            console.log("Response:", data, error); // Debugging output

            if (error) {
                throw error;
            }

            // Store login time in database
            await supabase.from("login_logs").insert([{ user_email: email }]);

            // Successful login
            errorMessage.textContent = "Login successful!";
            errorMessage.style.color = "green";

            setTimeout(() => {
                window.location.href = "LoginLogs.html"; // Redirect to dashboard or main page
            }, 1500);
        } catch (err) {
            errorMessage.textContent = err.message;
            errorMessage.style.color = "red";
            console.error("Login Error:", err.message);
        }
    });
});
