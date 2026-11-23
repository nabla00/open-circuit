(function () {
  const container = document.getElementById("post-container");

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(dateStr) {
    const parsed = new Date(dateStr + "T00:00:00");
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function showError(message) {
    container.innerHTML = `<p class="status-message">${escapeHtml(message)}</p>`;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    showError("No post selected. Return to the main page to choose an entry.");
    return;
  }

  fetch("posts.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load posts.json");
      return res.json();
    })
    .then((posts) => {
      const post = posts.find((p) => p.slug === slug);
      if (!post) {
        showError("Post not found.");
        return null;
      }

      document.title = `${post.title} — My Blog`;

      return fetch(post.file)
        .then((res) => {
          if (!res.ok) throw new Error("Could not load post file");
          return res.text();
        })
        .then((content) => {
          const isHtml =
            post.format === "html" || post.file.toLowerCase().endsWith(".html");
          const renderedBody = isHtml ? content : window.renderMarkdown(content);
          const tagsHtml = (post.tags || [])
            .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
            .join("");

          container.innerHTML = `
            <header class="post-header">
              <div class="post-card-meta">
                <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
                <span class="format-badge">${isHtml ? "HTML" : "MD"}</span>
              </div>
              <h1>${escapeHtml(post.title)}</h1>
              <div class="post-tags">${tagsHtml}</div>
            </header>
            <div class="post-body">${renderedBody}</div>
          `;
        });
    })
    .catch(() => {
      showError(
        "Unable to load this post. Make sure the site is served over HTTP or GitHub Pages."
      );
    });
})();
