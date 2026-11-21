import { ArtefactFrame } from '../src/components/marketing/ArtefactFrame.web';

/** Full-bleed Flowless Tech Hero artefact as the marketing home (web). */
export default function HomeScreen() {
  return (
    <ArtefactFrame
      activeHref="/"
      title="AiKOVA — Engineered Intelligence. Delivered."
      src="/aikova-flowless-tech-hero.html?v=woo-vault-2"
      promo={{
        eyebrow: 'NEW · MULTIPURPOSE WOOCOMMERCE THEME',
        title: 'AiKOVA Multipurpose WooCommerce Theme — Builder · Filters · Variations',
        body: 'Template cards, banner images, header/layout elements, AJAX filters and swatches — WoodMart-class depth in AiKOVA vault colors.',
        href: '/woocommerce',
        cta: 'Open WooCommerce',
      }}
    />
  );
}
