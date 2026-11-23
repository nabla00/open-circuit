(function () {
  const postListEl = document.getElementById("post-list");
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  const tagFiltersEl = document.getElementById("tag-filters");
  const resultsCountEl = document.getElementById("results-count");

  let allPosts = [];
  let activeTag = "all";

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
      month: "short",
      day: "numeric",
    });
  }

  function renderTags() {
    const tagSet = new Set();
    allPosts.forEach((post) => {
      (post.tags || []).forEach((tag) => tagSet.add(tag));
    });

    const tags = ["all", ...Array.from(tagSet).sort()];
    tagFiltersEl.innerHTML = tags
      .map(
        (tag) =>
          `<button type="button" class="tag-btn${tag === activeTag ? " active" : ""}" data-tag="${escapeHtml(tag)}">${
            tag === "all" ? "All" : escapeHtml(tag)
          }</button>`
      )
      .join("");
  }

  function filterAndRender() {
    const query = searchInput.value.trim().toLowerCase();
    clearBtn.hidden = query.length === 0;

    const filtered = allPosts.filter((post) => {
      const matchesTag =
        activeTag === "all" || (post.tags || []).includes(activeTag);
      if (!matchesTag) return false;

      if (!query) return true;
      const haystack = [
        post.title,
        post.summary,
        post.date,
        ...(post.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    resultsCountEl.textContent = `${filtered.length} of ${allPosts.length} ${
      allPosts.length === 1 ? "post" : "posts"
    }`;

    if (filtered.length === 0) {
      postListEl.innerHTML = `<p class="status-message">No matching posts found. Try a different search term or tag.</p>`;
      return;
    }

    postListEl.innerHTML = filtered
      .map((post) => {
        const formatLabel = post.file.endsWith(".html") ? "HTML" : "MD";
        const tagsHtml = (post.tags || [])
          .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
          .join("");
        return `
          <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
            <div class="post-card-meta">
              <time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
              <span class="format-badge">${formatLabel}</span>
            </div>
            <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
            <p class="post-card-summary">${escapeHtml(post.summary)}</p>
            <div class="post-tags">${tagsHtml}</div>
          </a>
        `;
      })
      .join("");
  }

  searchInput.addEventListener("input", filterAndRender);

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    filterAndRender();
  });

  tagFiltersEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".tag-btn");
    if (!btn) return;
    activeTag = btn.dataset.tag;
    renderTags();
    filterAndRender();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      document.activeElement !== searchInput &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      searchInput.focus();
    }
  });

  fetch("posts.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load posts.json");
      return res.json();
    })
    .then((posts) => {
      allPosts = posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      renderTags();
      filterAndRender();
    })
    .catch(() => {
      postListEl.innerHTML =
        '<p class="status-message">Could not load posts. If previewing locally, serve the folder over HTTP (e.g. <code>python3 -m http.server</code>) or deploy to GitHub Pages.</p>';
    });
})();
