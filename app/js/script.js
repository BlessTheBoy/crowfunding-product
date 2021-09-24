var openMenuBtn = document.getElementById("burger");
var closeMenuBtn = document.getElementById("closeMenu");
var menuControls = document.getElementById("menuControls");
var nav = document.getElementById("nav");

openMenuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);

function openMenu() {
  nav.classList.add("open");
  menuControls.classList.add("open");
}
function closeMenu() {
  nav.classList.remove("open");
  menuControls.classList.remove("open");
}
