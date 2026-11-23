# Simple Dark-Theme GitHub Pages Blog

A lightweight, zero-build-step blog ready for GitHub Pages.

## Files Included

- `index.html` — Main page listing blog entries with a real-time search bar and tag filters.
- `post.html` — View page that renders a selected `.md` (Markdown) or `.html` entry.
- `styles.css` — Clean, responsive dark theme.
- `main.js` — Loads `posts.json`, renders the post list, and powers instant search and tag filtering.
- `post.js` — Reads `?slug=...` from the URL, fetches the entry file, and renders Markdown or HTML.
- `markdown.js` — Zero-dependency Markdown-to-HTML parser.
- `posts.json` — Manifest of all blog entries.
- `posts/` — Folder containing your `.md` and `.html` blog entries.

## Deploy to GitHub Pages

1. Create a GitHub repository and push all files in this folder to the `main` branch.
2. Go to **Settings → Pages** in your GitHub repository.
3. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, and click **Save**.
4. Your blog will be live at `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

## Add a New Post

1. Add a `.md` or `.html` file in `posts/`.
2. Add an entry to `posts.json`:
   ```json
   {
     "slug": "my-new-post",
     "title": "My New Post",
     "date": "2026-11-25",
     "summary": "Short description shown on the main page.",
     "tags": ["notes"],
     "file": "posts/my-new-post.md",
     "format": "markdown"
   }
   ```
3. Commit and push.

## Local Preview

Because browsers block `fetch()` on `file://` URLs, run a quick local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
