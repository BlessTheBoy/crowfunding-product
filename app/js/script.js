/***************************
Dom references
***************************/
// For nav
const openMenuBtn = document.getElementById("burger");
const closeMenuBtn = document.getElementById("closeMenu");
const menuControls = document.getElementById("menuControls");
const nav = document.getElementById("nav");

// For bookmark
const bookmarkBtn = document.getElementById("bookmarkBtn");

// For modals
const main = document.querySelector("#mainContent");
const popupModal = document.querySelector(".popup-modal");
const successModal = document.querySelector(".success-modal");
const modalTriggers = document.querySelectorAll(".popup-trigger");
const modalCloseTrigger = document.querySelector(".popup-modal__close");
const successModalCloseTrigger = document.querySelector(
  ".success-modal__close"
);
const bodyBlackout = document.querySelector(".body-blackout");
const cardWrap = document.querySelectorAll(".cardWrap");
const pledgeForms = document.querySelectorAll(".cardWrap form");
const modalHeader = document.querySelectorAll(".cardWrap .head");
const radios = document.querySelectorAll("input[type='radio']");
const forms = document.querySelectorAll(".productForm form");
const inputs = document.querySelectorAll(
  ".productForm form input[type='text']"
);
const donations = document.getElementById("donations");
const backers = document.getElementById("backers");
const progress = document.getElementById("progress");

/***************************
Variables
***************************/
let bookmarked = false;
let donationsValue = 89914;
let backersValue = 5007;
// Defining amount of products left and minimum pledges for products
let products = {
  "no-reward": { amount: null, minPledge: 0 },
  "bamboo-stand": { amount: 101, minPledge: 25 },
  "black-stand": { amount: 64, minPledge: 75 },
  "mahogany-stand": { amount: 0, minPledge: 200 },
};

/***************************
Navbar Logic
***************************/
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

/***************************
Bookmark Logic
***************************/
bookmarkBtn.addEventListener("click", addBookmark);

function addBookmark() {
  if (!bookmarked) {
    console.log("adding bookmark");
    bookmarkBtn.lastElementChild.innerText = "Bookmarked";
    bookmarkBtn.classList.add("bookmarked");
    bookmarked = true;
  }
}

/***************************
Modal Logic
***************************/

// close modals
modalCloseTrigger.addEventListener("click", () => {
  closeModal(popupModal);
});

// Close success modal
successModalCloseTrigger.addEventListener("click", () => {
  closeModal(successModal);
});

// Close modal when you click outside of it
bodyBlackout.addEventListener("click", () => {
  closeModal();
});

// Open modal when triggers are clicked
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const product = trigger.dataset.popupTrigger;
    openModal(popupModal, product);
  });
});

// Update selected product to match selected radio button
radios.forEach((radio) =>
  radio.addEventListener("input", () => updateSelection(radio.dataset.product))
);

// select product and check radio on header click
modalHeader.forEach((header) => {
  header.addEventListener("click", () => {
    let radio = header.nextElementSibling.querySelector("input[type='radio']");
    radio.checked = true;
    updateSelection(radio.dataset.product);
  });
});

// Handle pledge submission, validation and updating amounts
forms.forEach((form) => {
  let product = form.dataset.product;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let form = e.target;

    // Validate form input
    let pledge = validatePledge(form, products[`${product}`].minPledge);

    if (pledge) {
      // update donations
      donationsValue += pledge;
      backersValue += 1;
      products[`${product}`].amount -= 1;

      updateAmounts(product);

      // Show success modal
      closeModal(popupModal);
      openModal(successModal);
    }
  });

  // Auto validating pledge amounts
  let input = form.querySelector("input[type='text']");
  input.addEventListener("input", () => {
    validatePledge(form, products[`${product}`].minPledge);
  });
});

// Update amounts funtion
function updateAmounts(product) {
  donations.innerText = numberWithCommas(donationsValue);
  backers.innerText = numberWithCommas(backersValue);
  progress.value = donationsValue;

  // update amounts
  let amount = document.querySelectorAll(`.amount`);
  if (product) {
    // Update the product amount only
    amount.forEach((element) => {
      if (element.dataset.product === product) {
        if (products[`${product}`].amount === 0) {
          document
            .querySelectorAll(`.card[data-product=${product}]`)
            .forEach((card) => {
              card.classList.add("out-of-stock");
              let button = card.querySelector("button");
              button.disabled = true;
              button.innerText = "Out of Stock";
            });
          document
            .querySelectorAll(`.cardWrap[data-product=${product}]`)
            .forEach((card) => card.classList.add("out-of-stock"));
        }

        element.innerText = products[`${product}`].amount;
      }
    });
  } else {
    // Update all product amount
    amount.forEach((element) => {
      if (products[`${element.dataset.product}`].amount === 0) {
        document
          .querySelectorAll(`.card[data-product=${product}]`)
          .forEach((card) => {
            card.classList.add("out-of-stock");
            let button = card.querySelector("button");
            button.disabled = true;
            button.innerText = "Out of Stock";
          });
        document
          .querySelectorAll(`.cardWrap[data-product=${product}]`)
          .forEach((card) => card.classList.add("out-of-stock"));
      }

      element.innerText = products[`${element.dataset.product}`].amount;
    });
  }
}

// Close modal funtion
function closeModal(modal) {
  // Remove all error messages and inputs

  if (modal) {
    // close specified modal
    modal.classList.remove("is--visible");
  } else {
    // close all modals
    popupModal.classList.remove("is--visible");
    successModal.classList.remove("is--visible");
  }
  bodyBlackout.classList.remove("success");
  main.classList.remove("success");
  bodyBlackout.classList.remove("is-blacked-out");
  main.classList.remove("modal-opened");

  // remove all selections
  updateSelection();
}

// Open modal function
function openModal(modal, product) {
  if (product) {
    updateSelection(product);
  }
  modal.classList.add("is--visible");
  bodyBlackout.classList.add("is-blacked-out");
  main.classList.add("modal-opened");
  if (modal.dataset.popupModal === "success") {
    bodyBlackout.classList.add("success");
    // bodyBlackout.scrollBottom = 0;
    main.classList.add("success");
    modal.querySelector("button").focus();
  }
}

// Funtion to update selected product on modal
function updateSelection(product) {
  cardWrap.forEach((card) => {
    if (product && card.dataset.product == product) {
      // Check card
      card.classList.add("checked");
      card.querySelector("input[type='radio']").checked = true;

      // autofocus input
      card.querySelector("input[type='text']").focus();
    } else {
      // Uncheck card, clear inputs and clear errors
      card.classList.remove("checked");
      card.querySelector("input[type='radio']").checked = false;
      card.querySelector("input[type='text']").value = "";
      card.querySelector("form").classList.remove("error");
    }
  });
}

// Function to validate pledge amount
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

// turn numbers to comma seperated strings
function numberWithCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

// Update amounts on start
updateAmounts();

// Confirm script is connected
console.log("script loaded");


