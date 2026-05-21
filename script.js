const menu = document.getElementById("menu");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks.classList.remove("open");

  menu.classList.add("mingcute--menu-fill");
  menu.classList.remove("mingcute--close-fill");
  menu.classList.remove("active-icon");

  menu.setAttribute("aria-expanded", "false");
}

menu.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menu.classList.toggle("mingcute--menu-fill");
  menu.classList.toggle("mingcute--close-fill");
  menu.classList.toggle("active-icon");

  menu.setAttribute("aria-expanded", isOpen);
});

// Close when focus leaves BOTH button + nav
document.addEventListener("focusin", (e) => {
  const isInsideMenu = navLinks.contains(e.target) || menu.contains(e.target);

  if (!isInsideMenu && navLinks.classList.contains("open")) {
    closeMenu();
  }
});
