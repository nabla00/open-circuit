---
layout: post
title: Publishing with GitHub Pages
date: 2026-11-20
description: How to push this repository, enable GitHub Pages, and add new entries in seconds.
---

GitHub Pages has built-in support for Jekyll, so there is no local build step required to deploy.

## Setup Steps

1. Create a GitHub repository (such as `my-blog` or `<username>.github.io`).
2. Push all files from this folder to the `main` branch.
3. Open **Settings → Pages** in your repository.
4. Set **Source** to **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.

Within a minute or two, GitHub Pages will build your Markdown and HTML posts and publish the static site.
