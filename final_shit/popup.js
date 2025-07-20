console.log("🌐 popup.js loaded");

document.addEventListener("keydown", (e) => {
  if (e.key === "`") {
    location.reload();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("posts");

  let scrollTimeout = setTimeout(() => {
    console.log("🛑 Scroll stopped. Refreshing...");
    fetchVisiblePosts();
    location.reload();
  }, 60000); // 1 minute fallback

  function fetchVisiblePosts() {
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

            if (!window.__popupScrollListenerAdded) {
              window.__popupScrollListenerAdded = true;
              window.addEventListener("scroll", () => {
                chrome.runtime.sendMessage({ type: "PAGE_SCROLLED" });
              });
            }

            const posts = [];

            document.querySelectorAll("article").forEach((article) => {
              if (!isInViewport(article)) return;

              const images = Array.from(article.querySelectorAll("img"))
                .filter((img) => {
                  const { width, height } = img.getBoundingClientRect();
                  return width > 50 && height > 50 && !img.alt?.includes("Avatar");
                })
                .map((img) => ({
                  src: img.src,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                }));

              if (images.length === 0) return;

              let username = "";
              let caption = "";

              const userEl = article.querySelector('[data-testid="User-Name"]');
              if (userEl) {
                username = userEl.innerText || userEl.textContent || "";
              }

              const captionEl = article.querySelector('[data-testid="tweetText"]');
              if (captionEl) {
                caption = captionEl.innerText || captionEl.textContent || "";
              }

              posts.push({
                username: username || "[No user]",
                caption: caption || "[No caption]",
                images,
              });
            });

            return posts;
          },
        },
        async (injectionResults) => {
          const posts = injectionResults?.[0]?.result || [];
          postsContainer.innerHTML = "";

          if (!posts.length) {
            postsContainer.innerHTML = "<p>No visible posts found.</p>";
            return;
          }

          for (const post of posts) {
            const postEl = document.createElement("div");
            postEl.className = "post";

            const textBlock = document.createElement("div");
            textBlock.className = "text-block";
            textBlock.innerHTML = `
              👤 <strong>Username:</strong> ${post.username}<br>
              📢 <em>Has posted:</em><br>
              📝 <strong>Caption:</strong> ${post.caption}
            `;
            postEl.appendChild(textBlock);

            readAloud(`Username: ${post.username} has posted: Caption: ${post.caption}`);

            for (const imgData of post.images) {
              const imgEl = document.createElement("img");
              imgEl.src = imgData.src;
              imgEl.alt = "Post Image";
              imgEl.style.maxWidth = "100%";
              postEl.appendChild(imgEl);

              const dims = document.createElement("div");
              dims.className = "dims";
              dims.textContent = `🖼️ Image Dimensions: ${imgData.width}×${imgData.height}`;
              postEl.appendChild(dims);

              const captionEl = document.createElement("div");
              captionEl.className = "caption";
              captionEl.textContent = "🔄 Generating caption...";
              postEl.appendChild(captionEl);
              // may add this if needed  
              // readAloud(`Generating caption...`);

              // 🧠 Fetch & speak image caption
              fetchCaptionFromAPI(imgData.src).then((realCaption) => {
                captionEl.textContent = `🧠 AI Caption: ${realCaption}`;
                readAloud(`Image details: ${realCaption}`);
              });
            }

            postsContainer.appendChild(postEl);
          }
        }
      );
    });
  }

  function readAloud(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function fetchCaptionFromAPI(imageUrl) {
    try {
      const response = await fetch("http://localhost:5000/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      return data.caption || "No caption found.";
    } catch (err) {
      console.error("❌ Caption API Error:", err);
      return "❌ Error fetching caption.";
    }
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "PAGE_SCROLLED") {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        console.log("🔄 Page scroll detected. Refreshing...");
        location.reload();
      }, 500);
    }
  });

  fetchVisiblePosts();
});
