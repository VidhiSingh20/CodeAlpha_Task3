document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful! Redirecting to login...");
      window.location.href = "/login.html";
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (err) {
    alert("An error occurred. Please try again.");
  }
});
