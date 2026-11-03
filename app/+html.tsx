import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/** Web document shell — deep void vault + crawler/LLM readable meta. */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>AiKOVA — Engineered Intelligence. Delivered.</title>
        <meta
          name="description"
          content="AiKOVA is a boutique digital engineering consultancy building industrial-grade Cloud, Payments, AI, and Industrial OS. Oldham OL8 → Global. Portfolio: VisaGuide, ReelStorm, Vexo, TradeFlow, Arole Adjo, Road Angel, MyFace Profile, AI Receptionist."
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#05070D" />
        <link rel="canonical" href="https://aikova.co.uk/" />
        <link rel="alternate" type="text/plain" href="https://aikova.co.uk/llms.txt" title="llms.txt" />
        <link rel="alternate" href="https://aikova.co.uk/aikova-ai-readable.html" title="AI-readable HTML" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AiKOVA" />
        <meta property="og:title" content="AiKOVA — Engineered Intelligence. Delivered." />
        <meta
          property="og:description"
          content="Boutique digital engineering. Industrial Cloud, Payments, AI & Industrial OS from Oldham OL8 → Global. Eight shipping OS including MyFace Profile and AI Receptionist."
        />
        <meta property="og:url" content="https://aikova.co.uk/" />
        <meta property="og:image" content="https://aikova.co.uk/aikova-og-linkedin.jpg" />
        <meta property="og:image:secure_url" content="https://aikova.co.uk/aikova-og-linkedin.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="627" />
        <meta
          property="og:image:alt"
          content="AiKOVA — Engineered Intelligence. Delivered. Oldham OL8 to Global."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AiKOVA — Engineered Intelligence. Delivered." />
        <meta
          name="twitter:description"
          content="Boutique senior engineering. Industrial OS. ISO 27001 · PCI DSS · DOS7-ready patterns."
        />
        <meta name="twitter:image" content="https://aikova.co.uk/aikova-og-linkedin.jpg" />
        <ScrollViewStyleReset />
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: responsiveRoot }} />
      </head>
      <body>
        {/* AI readability is via /llms.txt + nginx bot → /aikova-ai-readable.html — no visible page text. */}
        {children}
      </body>
    </html>
  );
}

const responsiveRoot = `
html, body, #root {
  width: 100%;
  height: 100%;
  margin: 0;
  background: #05070D;
  color: #FFFFFF;
}
body {
  overflow-x: hidden;
}
#root {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 100%;
}
a {
  color: inherit;
  text-decoration: none;
}
`;
