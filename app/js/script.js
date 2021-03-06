// Initializing micromodal
MicroModal.init({
  onShow: (modal) => console.log(`${modal.id} is shown`), // [1]
  onClose: (modal) => {
    updateSelection();
  }, // [2]
  // openTrigger: "data-custom-open", // [3]
  // closeTrigger: "data-custom-close", // [4]
  openClass: "is-open", // [5]
  disableScroll: true, // [6]
  disableFocus: false, // [7]
  awaitOpenAnimation: true, // [8]
  awaitCloseAnimation: true, // [9]
  debugMode: true, // [10]
});

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
const popupModal = document.querySelector(".popup-modal");
const modalTriggers = document.querySelectorAll(".popup-trigger");
const modalCloseTrigger = document.querySelector(".popup-modal__close");
const successModalCloseTrigger = document.querySelector(
  ".success-modal__close"
);
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
// modalCloseTrigger.addEventListener("click", () => {
//   MicroModal.close("selection-modal");
//   updateSelection();
// });

// Open modal when triggers are clicked
modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const product = trigger.dataset.popupTrigger;
    openModal(product);
  });
});

// Selecting card with keyboard on enter
cardWrap.forEach((card) => {
  card.addEventListener("keypress", selectCard);
});
function selectCard(e) {
  let keycode = e.keyCode ? e.keyCode : e.which;
  var caller = e.target || e.srcElement;
  if (caller.classList.contains("cardWrap") && keycode == "13") {
    let radio = caller.querySelector("input[type='radio']");
    radio.checked = true;
    updateSelection(radio.dataset.product);
  }
}

// triggers click event of element on enter
modalCloseTrigger.addEventListener("keypress", triggerClick);
function triggerClick(e) {
  let keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode == "13") {
    var caller = e.target || e.srcElement;
    caller.click();
  }
}

// Update selected product to match selected radio button
radios.forEach((radio) =>
  radio.addEventListener("change", () => updateSelection(radio.dataset.product))
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
      MicroModal.close("selection-modal");
      MicroModal.show("success-modal");
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
          let wrap = document.querySelector(
            `.cardWrap[data-product=${product}]`
          );
          wrap.classList.add("out-of-stock");
          wrap.tabIndex = "-1";
          wrap.querySelector("input[type='radio']").tabIndex = "-1";
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
          .forEach((card) => {
            card.classList.add("out-of-stock");
            card.tabIndex = "-1";
            card.querySelector("input[type='radio']").tabIndex = "-1";
          });
      }

      element.innerText = products[`${element.dataset.product}`].amount;
    });
  }
}

// Open modal function
function openModal(product) {
  MicroModal.show("selection-modal");

  if (product) {
    updateSelection(product);
    popupModal
      .querySelector(`.cardWrap[data-product=${product}] input[type='text']`)
      .focus();
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
