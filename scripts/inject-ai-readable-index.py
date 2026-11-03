#!/usr/bin/env python3
"""
Keep the human SPA shell clean.

AI platforms already get readable copy via nginx bot routing →
/aikova-ai-readable.html and /llms.txt. Do NOT inject visible body text into
dist/index.html (that shows above the designed homepage).

This script only ensures head meta/link tags exist; it strips any previously
injected visible #aikova-crawler-content / noscript mirror blocks.
"""
from pathlib import Path
import re
import sys

index = Path(sys.argv[1] if len(sys.argv) > 1 else "dist/index.html")
html = index.read_text()

# Remove any previously injected visible crawler blocks
html = re.sub(
    r'\s*<div id="aikova-crawler-content">[\s\S]*?</div>\s*',
    "\n",
    html,
    count=1,
)
# Remove the long noscript mirror we injected (keep Expo's short default noscript if present)
html = re.sub(
    r'\s*<noscript>\s*<main style="max-width:720px;[\s\S]*?</main>\s*</noscript>\s*',
    "\n",
    html,
    count=1,
)

# Ensure head has machine-readable discovery links (not visible page text)
if 'href="/llms.txt"' not in html and "href='/llms.txt'" not in html:
    head_bits = (
        '    <meta name="description" content="AiKOVA boutique digital engineering — Cloud, Payments, AI & Industrial OS. Oldham OL8 → Global." />\n'
        '    <meta name="robots" content="index,follow,max-image-preview:large" />\n'
        '    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />\n'
        '    <link rel="alternate" href="/aikova-ai-readable.html" title="AI-readable HTML" />\n'
    )
    if "<title>AiKOVA</title>" in html:
        html = html.replace(
            "<title>AiKOVA</title>",
            "<title>AiKOVA — Engineered Intelligence. Delivered.</title>\n" + head_bits,
            1,
        )
    elif "</head>" in html:
        html = html.replace("</head>", head_bits + "</head>", 1)

index.write_text(html)
print("cleaned visible crawler text from", index)
