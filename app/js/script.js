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
const forms = document.querySelectorAll(".productForm form");

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const { popupTrigger } = trigger.dataset;
    const popupModal = document.querySelector(
      `[data-popup-modal="${popupTrigger}"]`
    );

    function closeModal() {
      // Remove all error messages and inputs

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
      if (card.dataset.product == radio.dataset.product) {
        card.classList.add("checked");

        // autofocus input
        card.querySelector("input[type='text']").focus();
      } else {
        card.classList.remove("checked");
      }
    });
  })
);

function validatePledge(form, min = 0) {
  // Get children elements
  let input = form.querySelector("input[type='text']");
  let button = form.querySelector("input[type='submit']");
  let err = form.querySelector(".errorMessage");

  console.log("Validating");

  if (input.value === "") {
    form.classList.add("error");
    err.innerText = "enter amount";
    return;
  } else if (input.value.match(/\D/)) {
    form.classList.add("error");
    err.innerText = "enter numeric characters only [0-9]";
    return;
  } else if (Number(input.value) < min) {
    form.classList.add("error");
    err.innerText = `amount must be at least $${min}`;
    return;
  } else {
    form.classList.remove("error");
    err.innerText = "";
    return Number(input.value);
  }
}

forms.forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    console.log("form submitted");
    let form = e.target;

    // Validate form input

    validatePledge(form);
    // Show success modal
    // update donations
  })
);
