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
                  type: "image",
                  src: img.src,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                }));

              const gifs = images.filter((img) =>
                img.src.endsWith(".gif") ||
                img.src.includes("format=gif") ||
                img.src.includes(".gif?")
              ).map(gif => ({ ...gif, type: "gif" }));

              // Remove GIFs from the image list to avoid duplication
              const cleanImages = images.filter(img => !gifs.includes(img));

              const videoPlayers = Array.from(article.querySelectorAll('[data-testid="videoPlayer"]'));
              const videos = videoPlayers.map((container) => {
                const video = container.querySelector("video");
                if (!video) return null;
                const rect = video.getBoundingClientRect();
                if (rect.width < 100 || rect.height < 100) return null;
                let src = video.currentSrc || video.src || (video.querySelector("source")?.src ?? "");
                if (src.startsWith("blob:")) src = ""; // blob URLs can't be fetched or passed to AI

                return {
                  type: "video",
                  src,
                  width: video.videoWidth || rect.width,
                  height: video.videoHeight || rect.height,
                };
              }).filter(Boolean);

              const media = [...cleanImages, ...gifs, ...videos];
              if (media.length === 0) return;

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
                media,
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

            for (const mediaItem of post.media) {
              let mediaEl;

              if (mediaItem.type === "image" || mediaItem.type === "gif") {
                mediaEl = document.createElement("img");
                mediaEl.src = mediaItem.src;
                mediaEl.alt = "Post Media";
                mediaEl.style.maxWidth = "100%";
              } else if (mediaItem.type === "video") {
                mediaEl = document.createElement("video");
                mediaEl.src = mediaItem.src;
                mediaEl.controls = true;
                mediaEl.style.maxWidth = "100%";
              }

              postEl.appendChild(mediaEl);

              const dims = document.createElement("div");
              dims.className = "dims";
              dims.textContent = `📺 ${mediaItem.type.toUpperCase()} Dimensions: ${mediaItem.width}×${mediaItem.height}`;
              postEl.appendChild(dims);

              const captionEl = document.createElement("div");
              captionEl.className = "caption";
              captionEl.textContent = "🔄 Generating caption...";
              postEl.appendChild(captionEl);

              fetchCaptionFromAPI(mediaItem.src).then((realCaption) => {
                captionEl.textContent = `🧠 AI Caption: ${realCaption}`;
                readAloud(`Media description: ${realCaption}`);
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

  async function fetchCaptionFromAPI(mediaUrl) {
    try {
      const response = await fetch("http://localhost:5000/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: mediaUrl }),
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
