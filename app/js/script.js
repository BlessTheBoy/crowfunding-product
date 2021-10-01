// Navbar operation code
var openMenuBtn = document.getElementById("burger");
var closeMenuBtn = document.getElementById("closeMenu");
var menuControls = document.getElementById("menuControls");
var nav = document.getElementById("nav");

console.log("script loaded");

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

// Bookmark page
var bookmarkBtn = document.getElementById("bookmarkBtn");
bookmarkBtn.addEventListener("click", addBookmark);

let bookmarked = false;

function addBookmark() {
  if (!bookmarked) {
    console.log("adding bookmark");
    bookmarkBtn.lastElementChild.innerText = "Bookmarked";
    bookmarkBtn.classList.add("bookmarked");
    bookmarked = true;
  }
}

// Modals
const modal = document.querySelector(".popup-modal");
const modalTriggers = document.querySelectorAll(".popup-trigger");
const modalCloseTrigger = document.querySelector(".popup-modal__close");
const bodyBlackout = document.querySelector(".body-blackout");
const cardWrap = document.querySelectorAll(".cardWrap");
const radios = document.querySelectorAll("input[type='radio']");

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const { popupTrigger } = trigger.dataset;
    const popupModal = document.querySelector(
      `[data-popup-modal="${popupTrigger}"]`
    );

    function closeModal() {
      console.log("Close modal");
      popupModal.classList.remove("is--visible");
      bodyBlackout.classList.remove("is-blacked-out");
    }

    popupModal.classList.add("is--visible");
    bodyBlackout.classList.add("is-blacked-out");

    popupModal
      .querySelector(".popup-modal__close")
      .addEventListener("click", () => {
        closeModal();
      });

    bodyBlackout.addEventListener("click", () => {
      closeModal();
    });
  });
});

radios.forEach((radio) =>
  radio.addEventListener("change", () => {
    cardWrap.forEach((card) => {
      card.classList.remove("checked");
    });
  })
);
