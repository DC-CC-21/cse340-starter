const form = document.querySelector("#updateForm");
form.addEventListener("change", () => {
  const updateBtn = document.querySelector("#updateBtn");
  updateBtn.removeAttribute("disabled");
});
