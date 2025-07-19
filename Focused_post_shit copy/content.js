function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function extractVisiblePosts() {
  const posts = [];

  document.querySelectorAll("div").forEach(div => {
    if (!isInViewport(div)) return;

    const images = Array.from(div.querySelectorAll("img"))
      .map(img => img.src)
      .filter(src => src && !src.startsWith("data:"));

    if (!images.length) return;

    const captionEl = div.querySelector("span, p");
    const caption = captionEl?.innerText || null;

    posts.push({ caption, images });
  });

  return posts;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "extract_visible_posts") {
    const results = extractVisiblePosts();
    sendResponse(results);
  }
});
