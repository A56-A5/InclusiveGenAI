document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          function isInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
              rect.top >= 0 &&
              rect.left >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
          }

          const posts = [];

          document.querySelectorAll("article").forEach(article => {
            if (!isInViewport(article)) return;

            const images = Array.from(article.querySelectorAll("img"))
              .filter(img => {
                // Skip images that are likely profile icons (tiny or topmost)
                const { width, height } = img.getBoundingClientRect();
                return width > 50 && height > 50;
              })
              .map(img => ({
                src: img.src,
                width: img.naturalWidth,
                height: img.naturalHeight
              }));

            if (images.length === 0) return;

            // Try to extract meaningful caption
            let caption = '';
            const captionCandidate = Array.from(article.querySelectorAll("span, div"))
              .find(el => el.textContent && el.textContent.trim().length > 30);
            if (captionCandidate) caption = captionCandidate.textContent.trim();

            posts.push({ caption, images });
          });

          return posts;
        },
      },
      (injectionResults) => {
        const posts = injectionResults?.[0]?.result || [];
        const postsContainer = document.getElementById("posts");
        postsContainer.innerHTML = "";

        if (!posts.length) {
          postsContainer.innerHTML = "<p>No visible posts found.</p>";
          return;
        }

        posts.forEach((post) => {
          const postEl = document.createElement("div");
          postEl.className = "post";

          if (post.caption) {
            const captionEl = document.createElement("div");
            captionEl.className = "caption";
            captionEl.textContent = post.caption;
            postEl.appendChild(captionEl);
          }

          post.images.forEach((imgData) => {
            const imgEl = document.createElement("img");
            imgEl.src = imgData.src;
            imgEl.alt = "Post Image";
            const dims = document.createElement("div");
            dims.className = "dims";
            dims.textContent = `(${imgData.width}×${imgData.height})`;
            postEl.appendChild(imgEl);
            postEl.appendChild(dims);
          });

          postsContainer.appendChild(postEl);
        });
      }
    );
  });
});
