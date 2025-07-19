// No background logic needed for now
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "reload_extension") {
    console.log("🔁 Reloading extension...");
    chrome.runtime.reload();
  }
});
