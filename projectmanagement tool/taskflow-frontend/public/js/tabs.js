function showTab(tabId) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => tab.classList.add("hidden"));
  document.getElementById(`${tabId}-tab`).classList.remove("hidden");

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    if (tabId === "dashboard") {
      logoutBtn.classList.remove("hidden");
    } else {
      logoutBtn.classList.add("hidden");
    }
  }

  if (tabId === "register") document.getElementById("register-form").reset();
  if (tabId === "login") document.getElementById("login-form").reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    showTab("dashboard");
  } else {
    showTab("login");
  }
});
