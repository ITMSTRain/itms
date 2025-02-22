document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        errorMessage.textContent = "Signup successful! Check your email for verification.";
        errorMessage.style.color = "green";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    } catch (err) {
        errorMessage.textContent = err.message;
        errorMessage.style.color = "red";
    }
});
