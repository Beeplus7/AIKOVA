#!/usr/bin/env python3
"""Inject no-JS crawler/LLM content into Expo web dist/index.html."""
from pathlib import Path
import sys

index = Path(sys.argv[1] if len(sys.argv) > 1 else "dist/index.html")
html = index.read_text()
if "aikova-crawler-content" in html:
    print("index already AI-readable")
    raise SystemExit(0)

inject = """
    <div id="aikova-crawler-content">
      <h1>AiKOVA — Engineered Intelligence. Delivered.</h1>
      <p>Boutique digital engineering consultancy. Industrial-grade Cloud, Payments, AI and Industrial OS from Oldham OL8 to global edge.</p>
      <p>Machine summary: <a href="/llms.txt">/llms.txt</a> · No-JS mirror: <a href="/aikova-ai-readable.html">/aikova-ai-readable.html</a></p>
      <h2>Portfolio OS (8)</h2>
      <ul>
        <li>VisaGuide OS — visaguideos.com</li>
        <li>ReelStorm OS — reelstorm.uk</li>
        <li>Vexo Garage OS — vexogarage.co.uk</li>
        <li>TradeFlow OS — tradeflow.finance</li>
        <li>Arole Adjo OS — aroleadjo.com</li>
        <li>Road Angel OS — logistics + fleet</li>
        <li>MyFace Profile OS — myfaceprofile.aikova.co.uk</li>
        <li>AI Receptionist OS — ai-receptionist.aikova.co.uk</li>
      </ul>
      <p>Pages: <a href="/portfolio">Portfolio</a>, <a href="/services">Services</a>, <a href="/solutions">Solutions</a>, <a href="/industries">Industries</a>, <a href="/contact">Contact</a>.</p>
    </div>
    <noscript>
      <main style="max-width:720px;margin:40px auto;padding:24px;font-family:system-ui;color:#E6EAF2;background:#05070D">
        <h1>AiKOVA — Engineered Intelligence. Delivered.</h1>
        <p>Enable JavaScript for the full interactive site, or read <a href="/aikova-ai-readable.html" style="color:#84FF3D">the AI-readable page</a> / <a href="/llms.txt" style="color:#84FF3D">llms.txt</a>.</p>
      </main>
    </noscript>
"""

if '<div id="root"></div>' in html:
    html = html.replace('<div id="root"></div>', inject + '\n    <div id="root"></div>', 1)
else:
    html = html.replace("</body>", inject + "\n</body>", 1)

if "<title>AiKOVA</title>" in html:
    html = html.replace(
        "<title>AiKOVA</title>",
        '<title>AiKOVA — Engineered Intelligence. Delivered.</title>\n'
        '    <meta name="description" content="AiKOVA boutique digital engineering — Cloud, Payments, AI & Industrial OS. Oldham OL8 → Global. Eight portfolio OS including MyFace Profile and AI Receptionist." />\n'
        '    <meta name="robots" content="index,follow,max-image-preview:large" />\n'
        '    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />\n'
        '    <link rel="alternate" href="/aikova-ai-readable.html" title="AI-readable HTML" />',
        1,
    )

index.write_text(html)
print("patched", index)
