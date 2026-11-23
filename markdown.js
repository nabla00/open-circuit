// Lightweight zero-dependency Markdown-to-HTML renderer
(function (global) {
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderInline(text) {
    let out = escapeHtml(text);

    // Inline code
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Links [label](url)
    out = out.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+|\.?\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    // Bold (**text** or __text__)
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    // Italic (*text* or _text_)
    out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    out = out.replace(/\b_([^_]+)_\b/g, "<em>$1</em>");

    return out;
  }

  function renderMarkdown(md) {
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let inCodeBlock = false;
    let codeLang = "";
    let codeLines = [];
    let inUl = false;
    let inOl = false;
    let inBlockquote = false;
    let paragraphLines = [];

    function flushParagraph() {
      if (paragraphLines.length > 0) {
        html.push("<p>" + renderInline(paragraphLines.join(" ")) + "</p>");
        paragraphLines = [];
      }
    }

    function closeLists() {
      if (inUl) {
        html.push("</ul>");
        inUl = false;
      }
      if (inOl) {
        html.push("</ol>");
        inOl = false;
      }
    }

    function closeBlockquote() {
      if (inBlockquote) {
        html.push("</blockquote>");
        inBlockquote = false;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Fenced code blocks
      const fenceMatch = line.match(/^```(\w*)\s*$/);
      if (fenceMatch) {
        if (inCodeBlock) {
          const langAttr = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
          html.push(`<pre><code${langAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
          inCodeBlock = false;
          codeLang = "";
          codeLines = [];
        } else {
          flushParagraph();
          closeLists();
          closeBlockquote();
          inCodeBlock = true;
          codeLang = fenceMatch[1] || "";
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Blank line
      if (/^\s*$/.test(line)) {
        flushParagraph();
        closeLists();
        closeBlockquote();
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        flushParagraph();
        closeLists();
        closeBlockquote();
        html.push("<hr />");
        continue;
      }

      // Headings
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        closeLists();
        closeBlockquote();
        const level = headingMatch[1].length;
        html.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
        continue;
      }

      // Blockquote
      const bqMatch = line.match(/^>\s?(.*)$/);
      if (bqMatch) {
        flushParagraph();
        closeLists();
        if (!inBlockquote) {
          html.push("<blockquote>");
          inBlockquote = true;
        }
        html.push("<p>" + renderInline(bqMatch[1]) + "</p>");
        continue;
      } else {
        closeBlockquote();
      }

      // Unordered list
      const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);
      if (ulMatch) {
        flushParagraph();
        if (inOl) {
          html.push("</ol>");
          inOl = false;
        }
        if (!inUl) {
          html.push("<ul>");
          inUl = true;
        }
        html.push("<li>" + renderInline(ulMatch[1]) + "</li>");
        continue;
      }

      // Ordered list
      const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
      if (olMatch) {
        flushParagraph();
        if (inUl) {
          html.push("</ul>");
          inUl = false;
        }
        if (!inOl) {
          html.push("<ol>");
          inOl = true;
        }
        html.push("<li>" + renderInline(olMatch[1]) + "</li>");
        continue;
      }

      // Regular paragraph line
      closeLists();
      paragraphLines.push(line.trim());
    }

    flushParagraph();
    closeLists();
    closeBlockquote();

    if (inCodeBlock) {
      html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    }

    return html.join("\n");
  }

  global.renderMarkdown = renderMarkdown;
})(window);
