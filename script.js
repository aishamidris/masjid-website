document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Registration Page Logic
  const isRegistrationPage = document.querySelector(".registration-page");
  if (isRegistrationPage) {
    const regForm = document.getElementById("registration-form");

    regForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const pin = document.querySelector('input[name="pin"]').value.trim();
      if (pin !== "12345") {
        showMessage("❌ Invalid registration PIN. Only authorized community members can register.", "error");
        return;
      }

      const formData = new FormData(regForm);

      fetch("https://script.google.com/macros/s/AKfycbyYNml_yiRciNlk4CmfDIEkV687IxEZydqNoTOL05lgIw2DD3h46MVNGEgO9lo660i-/exec", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((text) => {
          if (text === "success") {
  alert("✅ Registration successful!");
  window.location.href = "index.html"; // Go back to home
}
 else if (text === "duplicate") {
            showMessage("⚠️ You’ve already registered.", "error");
          } else {
            showMessage("⚠️ Something went wrong. Try again.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          showMessage("❌ Network error. Please try again.", "error");
        });
    });
  }

  // 🔹 Loan Page Logic
  const isLoanPage = document.querySelector(".loan-page");
  if (isLoanPage) {
    const loanForm = document.getElementById("loan-form");

    loanForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const pin = document.querySelector('input[name="pin"]').value.trim();
      const amount = parseFloat(document.querySelector('input[name="amount"]').value);

      if (pin !== "12345") {
        showMessage("❌ Invalid PIN. Only approved community members may request a loan.", "error");
        return;
      }

      if (amount > 10000) {
        showMessage("❌ Loan amount cannot exceed ₦10,000.", "error");
        return;
      }

      const formData = new FormData(loanForm);

      fetch("https://script.google.com/macros/s/AKfycbywpJ2kih0StvBDK8izKJqR4Uyq9FzfoGp0ZhDLimAw9Xmtc_iDDX5qn1Wr76xIaJ-vsA/exec", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.text())
        .then((text) => {
          if (text === "success") {
            showMessage("✅ Loan request submitted successfully!", "success");
            loanForm.reset();
          } else if (text === "duplicate") {
            showMessage("⚠️ You have already submitted a request.", "error");
          } else {
            showMessage("⚠️ Something went wrong. Please try again.", "error");
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          showMessage("❌ Submission failed. Please try again later.", "error");
        });
    });
  }

  // 🔹 Shared showMessage Function
  function showMessage(message, type) {
    const box = document.getElementById("message-box");
    if (!box) return;
    box.textContent = message;
    box.className = type;
    box.style.display = "block";
  }
});
