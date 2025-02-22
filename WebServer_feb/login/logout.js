document.addEventListener("DOMContentLoaded", async () => {
    const SUPABASE_URL = "https://wcdscmlpgtstfwuagutt.supabase.co";  // Replace with your Supabase URL
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHNjbWxwZ3RzdGZ3dWFndXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMjE2NDAsImV4cCI6MjA1MzY5NzY0MH0.BrYUgkRLDsx0lOccC0x2IlNsi0RzoMDgu0SfgJCCuwI";  // Replace with your Supabase Anon Key

    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    async function logout() {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error("Error fetching user:", userError.message);
            return;
        }

        if (user) {
            await supabase
                .from("login_logs")
                .update({ logout_time: new Date().toISOString() })
                .eq("user_email", user.email)
                .is("logout_time", null);
        }

        await supabase.auth.signOut();
        window.location.href = "login.html";
    }

    document.getElementById("logoutButton").addEventListener("click", logout);
});
