"use strict";var openMenuBtn=document.getElementById("burger"),closeMenuBtn=document.getElementById("closeMenu"),menuControls=document.getElementById("menuControls"),nav=document.getElementById("nav");function openMenu(){nav.classList.add("open"),menuControls.classList.add("open")}function closeMenu(){nav.classList.remove("open"),menuControls.classList.remove("open")}console.log("script loaded"),openMenuBtn.addEventListener("click",openMenu),closeMenuBtn.addEventListener("click",closeMenu);var bookmarkBtn=document.getElementById("bookmarkBtn");bookmarkBtn.addEventListener("click",addBookmark);var bookmarked=!1;function addBookmark(){bookmarked||(console.log("adding bookmark"),bookmarkBtn.lastElementChild.innerText="Bookmarked",bookmarkBtn.classList.add("bookmarked"),bookmarked=!0)}
//# sourceMappingURL=script.js.map