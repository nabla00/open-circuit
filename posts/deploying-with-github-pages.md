Publishing this blog on **GitHub Pages** takes only a couple of minutes and requires no build pipeline.

## Quick Setup

1. Create a new repository on GitHub (for example, `my-blog` or `<username>.github.io`).
2. Upload all files from this folder to the root of your repository.
3. Open **Settings → Pages** in your repository.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.

## Previewing Locally

Because the site fetches `posts.json` and files in `posts/`, open it through a local HTTP server rather than `file://`:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Adding a New Entry

- Create `posts/my-new-post.md` (or `.html`).
- Add a new object to `posts.json` with a unique `slug`, `title`, `date` (`YYYY-MM-DD`), `summary`, `tags`, and `file`.
- Push your changes — GitHub Pages automatically serves the updated site.
