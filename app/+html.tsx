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
          content="AiKOVA is a boutique digital engineering consultancy building industrial-grade Cloud, Payments, AI, and Industrial OS. Oldham OL8 → Global. Portfolio: VisaGuide, ReelStorm, Vexo, TradeFlow, Arole Adjo, Road Angel."
        />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#05070D" />
        <link rel="canonical" href="https://aikova.co.uk/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AiKOVA" />
        <meta property="og:title" content="AiKOVA — Engineered Intelligence. Delivered." />
        <meta
          property="og:description"
          content="Industrial-grade OS engineering: cloud, payments, AI production, garage/MOT, FinTech, and logistics. Portfolio and portal live at aikova.co.uk."
        />
        <meta property="og:url" content="https://aikova.co.uk/" />
        <meta property="og:image" content="https://aikova.co.uk/aikova-portfolio-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AiKOVA — Engineered Intelligence. Delivered." />
        <meta
          name="twitter:description"
          content="Boutique senior engineering. Industrial OS. ISO 27001 · PCI DSS · DOS7-ready patterns."
        />
        <ScrollViewStyleReset />
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: responsiveRoot }} />
      </head>
      <body>
        {/* Always in HTML for crawlers/LLMs that skip noscript and do not run JS */}
        <div
          id="aikova-crawler-content"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <h1>AiKOVA — Engineered Intelligence. Delivered.</h1>
          <p>
            Boutique digital engineering consultancy. Industrial-grade Cloud, Payments, AI and
            Industrial OS from Oldham OL8 to global edge.
          </p>
          <h2>Portfolio OS</h2>
          <ul>
            <li>VisaGuide OS — visaguideos.com</li>
            <li>ReelStorm OS — reelstorm.uk</li>
            <li>Vexo Garage OS — DVSA MOT + garage management</li>
            <li>TradeFlow OS — tradeflow.finance</li>
            <li>Arole Adjo OS — aroleadjo.com</li>
            <li>Road Angel OS — logistics + fleet</li>
          </ul>
          <p>
            Pages: <a href="https://aikova.co.uk/portfolio">Portfolio</a>,{' '}
            <a href="https://aikova.co.uk/services">Services</a>,{' '}
            <a href="https://aikova.co.uk/solutions">Solutions</a>,{' '}
            <a href="https://aikova.co.uk/industries">Industries</a>,{' '}
            <a href="https://aikova.co.uk/contact">Contact</a>,{' '}
            <a href="https://aikova.co.uk/os/portal">Portal</a>.
          </p>
        </div>
        <noscript>
          <main style={{ maxWidth: 720, margin: '40px auto', padding: 24, fontFamily: 'system-ui', color: '#E6EAF2', background: '#05070D' }}>
            <h1>AiKOVA — Engineered Intelligence. Delivered.</h1>
            <p>
              Boutique software engineering consultancy building Cloud, Payments &amp; Industrial OS.
              Open these pages directly:
            </p>
            <ul>
              <li><a href="/portfolio" style={{ color: '#84FF3D' }}>Portfolio OS</a></li>
              <li><a href="/services" style={{ color: '#84FF3D' }}>Services</a></li>
              <li><a href="/solutions" style={{ color: '#84FF3D' }}>Solutions</a></li>
              <li><a href="/industries" style={{ color: '#84FF3D' }}>Industries</a></li>
              <li><a href="/contact" style={{ color: '#84FF3D' }}>Contact</a></li>
              <li><a href="/os/portal" style={{ color: '#84FF3D' }}>Client / Admin Portal</a></li>
            </ul>
          </main>
        </noscript>
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
