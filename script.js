document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (e) {
    const pinInput = document.querySelector('input[name="pin"]');
    const pin = pinInput.value.trim();

    if (pin !== "12345") {
      e.preventDefault(); // Stop the form from submitting
      alert("Invalid PIN. Only authorized community members can register.");
    }
  });
});
