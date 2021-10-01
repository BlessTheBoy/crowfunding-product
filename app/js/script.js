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
const popupModal = document.querySelector(".popup-modal");
const successModal = document.querySelector(".success-modal");
const modalTriggers = document.querySelectorAll(".popup-trigger");
const modalCloseTrigger = document.querySelector(".popup-modal__close");
const successModalCloseTrigger = document.querySelector(
  ".success-modal__close"
);
const bodyBlackout = document.querySelector(".body-blackout");
const cardWrap = document.querySelectorAll(".cardWrap");
const radios = document.querySelectorAll("input[type='radio']");
const forms = document.querySelectorAll(".productForm form");
const inputs = document.querySelectorAll(
  ".productForm form input[type='text']"
);
const donations = document.getElementById("donations");
const backers = document.getElementById("backers");
const progress = document.getElementById("progress");

let donationsValue = 89914;
let backersValue = 5007;

donations.innerText = numberWithCommas(donationsValue);
backers.innerText = numberWithCommas(backersValue);
progress.value = donationsValue;

modalCloseTrigger.addEventListener("click", () => {
  closeModal(popupModal);
});

successModalCloseTrigger.addEventListener("click", () => {
  closeModal(successModal);
});

bodyBlackout.addEventListener("click", () => {
  closeModal();
});

// Close modal
function closeModal(modal) {
  // Remove all error messages and inputs

  if (modal) {
    modal.classList.remove("is--visible");
  } else {
    popupModal.classList.remove("is--visible");
    successModal.classList.remove("is--visible");
  }
  bodyBlackout.classList.remove("is-blacked-out");
}

// Open modal
function openModal(modal, product = null) {
  modal.classList.add("is--visible");
  bodyBlackout.classList.add("is-blacked-out");
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const { product } = trigger.dataset;
    openModal(popupModal, product);
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
  let err = form.querySelector(".errorMessage");

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

// Defining minimum pledges
let minPledge = {
  "no-reward": 0,
  "bamboo-stand": 25,
  "black-stand": 75,
  "mahogany-stand": 200,
};

forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let form = e.target;

    // Validate form input
    let pledge = validatePledge(form, minPledge[`${form.dataset.product}`]);

    if (pledge) {
      // update donations
      donationsValue += pledge;
      backersValue += 1;

      donations.innerText = numberWithCommas(donationsValue);
      backers.innerText = numberWithCommas(backersValue);
      progress.value = donationsValue;

      // update amount
      let amount = document.querySelectorAll(`.amount`);
      amount.forEach((element) => {
        if (element.dataset.product === form.dataset.product) {
          element.innerText = Number(element.innerText) - 1;
        }
      });
      // update amount left and disable if zero

      // Show success modal
      closeModal(popupModal);
      openModal(successModal);

      // select on header click
      // Open already selected

      console.log(`pledge`, pledge);
    }
  });
  let input = form.querySelector("input[type='text']");
  input.addEventListener("input", () => {
    validatePledge(form, minPledge[`${form.dataset.product}`]);
  });
});

function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
