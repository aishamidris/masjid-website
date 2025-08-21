document.addEventListener("DOMContentLoaded", function () {
  // ====== Config ======
  const ADMIN_REGISTER_PIN = "MASJID2025"; // change anytime
  const ADMIN_LOAN_PIN     = "LOAN2025";   // change anytime
  const REDIRECT_AFTER_MS  = 2000;
  const HOME_PAGE          = "index.html";
  const REGISTER_PAGE      = "register.html"; // used if we auto-redirect unregistered users
  const REQUIRE_REG_BEFORE_VIEWING_LOAN = false; // set true to auto-redirect away from loan page

  // ====== Helpers ======
  const messageBox = document.getElementById("message-box");
  function showMessage(text, type) {
    if (!messageBox) {
      alert(text);
      return;
    }
    messageBox.textContent = text;
    messageBox.style.display = "block";
    messageBox.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
    messageBox.style.color = type === "success" ? "#155724" : "#721c24";
  }

  function hasRegistered() {
    return localStorage.getItem("registered") === "true";
  }
  function hasAppliedForLoan() {
    return localStorage.getItem("loanApplied") === "true";
  }

  // Get forms (support both ids for registration)
  const registerForm =
    document.getElementById("register-form") ||
    document.getElementById("registration-form");
  const loanForm = document.getElementById("loan-form");

  // ====== Optional: block viewing loan page if not registered ======
  if (REQUIRE_REG_BEFORE_VIEWING_LOAN && loanForm && !hasRegistered()) {
    showMessage("❌ You must register before accessing the loan form. Redirecting…", "error");
    setTimeout(() => { window.location.href = REGISTER_PAGE; }, 1200);
    return; // stop further JS on this page
  }

  // ====== Registration Handler ======
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (hasRegistered()) {
        showMessage("❌ You have already registered.", "error");
        return;
      }

      // PIN / password input must have id="password"
      const passwordInput =
        document.getElementById("password") ||
        registerForm.querySelector('input[type="password"]');
      const password = passwordInput ? passwordInput.value : "";

      if (password !== ADMIN_REGISTER_PIN) {
        showMessage("❌ Invalid registration PIN. Please contact the admin.", "error");
        return;
      }

      const formData = new FormData(registerForm);

      fetch(registerForm.action, { method: "POST", body: formData })
        .then(res => res.text())
        .then(text => {
          const resp = (text || "").trim().toLowerCase();
          if (resp === "success") {
            localStorage.setItem("registered", "true");
            showMessage("✅ Registration successful! Redirecting…", "success");
            setTimeout(() => { window.location.href = HOME_PAGE; }, REDIRECT_AFTER_MS);
          } else if (resp === "duplicate") {
            // In case your registration script ever returns "duplicate"
            showMessage("❌ This phone or email is already registered.", "error");
          } else {
            showMessage("❌ Registration failed: " + text, "error");
          }
        })
        .catch(err => {
          console.error("Registration error:", err);
          showMessage("❌ Network error. Check your internet and try again.", "error");
        });
    });
  }

  // ====== Loan Handler ======
  if (loanForm) {
    loanForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!hasRegistered()) {
        showMessage("❌ You must register before applying for a loan.", "error");
        return;
      }

      if (hasAppliedForLoan()) {
        showMessage("❌ You have already applied for a loan.", "error");
        return;
      }

      const loanPinInput = loanForm.querySelector('input[name="pin"]');
      const loanPin = loanPinInput ? loanPinInput.value : "";
      if (loanPin !== ADMIN_LOAN_PIN) {
        showMessage("❌ Invalid loan authorization PIN. Please contact the admin.", "error");
        return;
      }

      const formData = new FormData(loanForm);

      fetch(loanForm.action, { method: "POST", body: formData })
        .then(res => res.text())
        .then(text => {
          const resp = (text || "").trim().toLowerCase();

          if (resp === "success") {
            localStorage.setItem("loanApplied", "true");
            showMessage("✅ Loan request submitted successfully! Redirecting…", "success");
            setTimeout(() => { window.location.href = HOME_PAGE; }, REDIRECT_AFTER_MS);
          } else if (resp === "duplicate") {
            showMessage("❌ You have already applied for a loan.", "error");
          } else {
            // Show raw text so you can see what GAS returned if unexpected
            showMessage("❌ Unexpected server response: " + text, "error");
          }
        })
        .catch(err => {
          console.error("Loan error:", err);
          showMessage("❌ Network error. Please check your internet and try again.", "error");
        });
    });
  }
});
