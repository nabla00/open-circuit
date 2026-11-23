# Minimal Dark-Theme Jekyll Blog (GitHub Pages)

A clean, static Jekyll blog with a dark theme, Markdown/HTML post rendering at build time, and a tiny search filter on the main page.

## Structure

- `_config.yml` — Site title, tagline, and Jekyll settings.
- `_layouts/default.html` — Base HTML layout (header, main container, footer).
- `_layouts/post.html` — Viewer layout for Markdown and HTML blog entries.
- `_posts/` — Your blog posts (`.md` or `.html`), named `YYYY-MM-DD-slug.md`.
- `assets/style.css` — Dark theme stylesheet.
- `index.html` — Main page listing Date, Header, and Description for each post, plus a search bar.

## Deploy to GitHub Pages

1. Push these files to the root of a GitHub repository on the `main` branch.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, select `main` and `/ (root)`, and click **Save**.

## Add a New Post

Create a file in `_posts/` named `YYYY-MM-DD-your-title.md` (or `.html`) with this front matter:

```yaml
---
layout: post
title: Your Post Header
date: 2026-11-25
description: A short description shown under the title.
---

Write your Markdown or HTML content here.
```

Commit and push — GitHub Pages automatically builds and updates the site.
