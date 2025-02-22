// Wait for DOM to load before executing script
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize Supabase
  const SUPABASE_URL = "https://wcdscmlpgtstfwuagutt.supabase.co";  // Replace with your Supabase URL
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjZHNjbWxwZ3RzdGZ3dWFndXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMjE2NDAsImV4cCI6MjA1MzY5NzY0MH0.BrYUgkRLDsx0lOccC0x2IlNsi0RzoMDgu0SfgJCCuwI";  // Replace with your Supabase Anon Key

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function fetchLogs() {
      const { data, error } = await supabase.from("login_logs").select("*").order("login_time", { ascending: false });

      if (error) {
          console.error("Error fetching logs:", error.message);
          return;
      }

      // Get table body
      const tableBody = document.querySelector(".logs-table tbody");
      tableBody.innerHTML = ""; // Clear previous data

      // Populate table
      data.forEach(log => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${log.user_email}</td>
              <td>${new Date(log.login_time).toLocaleDateString()}</td>
              <td>${new Date(log.login_time).toLocaleTimeString()}</td>
              <td>${log.logout_time ? new Date(log.logout_time).toLocaleTimeString() : "Still logged in"}</td>
          `;
          tableBody.appendChild(row);
      });
  }

  // Fetch logs when page loads
  fetchLogs();
});

function goBack() {
  window.location.href = "index.html";
}