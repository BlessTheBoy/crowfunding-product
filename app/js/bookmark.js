var currentTab;
var isBookmarked;
console.log("bookmark.js connected");

// Get current tab
browser.tabs.getCurrent().then(onGot, onError);

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */

function onGot(tabInfo) {
  console.log(tabInfo);
  currentTab = tabInfo;
}

function onError(error) {
  console.log(`Error: ${error}`);
}

/*
 * check if url is supported
 */
function isSupportedProtocol(urlString) {
  var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
  var url = document.createElement("a");
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

/*
 * checks if page was preiously bookmarked
 */
function checkBookmark() {
  console.log("Checking for bookmark");
  if (isSupportedProtocol(currentTab.url)) {
    var searching = browser.bookmarks.search({ url: currentTab.url });
    searching.then((bookmarks) => {
      if (bookmarks.length > 0) {
        isBookmarked = true;
        console.log("bookmark found");
        return;
      }

      isBookmarked = false;
      console.log("Page hasn't been bookmarked");
    });
  } else {
    console.log(`Bookmark it! does not support the '${currentTab.url}' URL.`);
  }
}

/*
 * Bookmark the current page.
 */
function addBookmark() {
  if (!currentBookmark) {
    browser.bookmarks.create({ title: currentTab.title, url: currentTab.url });
    isBookmarked = true;
    alert("Bookmark added");
  } else {
    console.log("Page was already bookmarked");
  }
}

// listen for bookmarks being created
browser.bookmarks.onCreated.addListener(checkBookmark);

// listen for bookmarks being removed
browser.bookmarks.onRemoved.addListener(checkBookmark);

// listen to tab URL changes
browser.tabs.onUpdated.addListener(checkBookmark);

// update when the extension loads initially
// checkBookmark();
