const API_BASE = "http://localhost:5000";

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registered successfully!");
      showTab("login");
    } else {
      alert(data.error || "Registration failed");
    }
  } catch {
    alert("Something went wrong");
  }
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login successful!");
      showTab("dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  } catch {
    alert("Something went wrong");
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("Logged out");
  showTab("login");
}