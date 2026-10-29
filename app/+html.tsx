import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/** Web document shell — deep void vault, full-bleed root for RN-web. */
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
        <meta name="theme-color" content="#05070D" />
        <ScrollViewStyleReset />
        {/* Portfolio OS artefact uses Tailwind utility classes on web */}
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: responsiveRoot }} />
      </head>
      <body>{children}</body>
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