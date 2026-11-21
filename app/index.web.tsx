import { ArtefactFrame } from '../src/components/marketing/ArtefactFrame.web';

/** Full-bleed Flowless Tech Hero artefact as the marketing home (web). */
export default function HomeScreen() {
  return (
    <ArtefactFrame
      activeHref="/"
      title="AiKOVA — Engineered Intelligence. Delivered."
      src="/aikova-flowless-tech-hero.html?v=woo-banner-1"
      promo={{
        eyebrow: 'NEW · MULTIPURPOSE WOOCOMMERCE THEME',
        title: 'AiKOVA Multipurpose WooCommerce Theme — 100+ demos + Builder',
        body: 'Banners, cards, infographics and a WoodMart-class commerce toolkit. Explore demos, import in one click, customise with AiKOVA Builder.',
        href: '/woocommerce',
        cta: 'Open WooCommerce',
      }}
    />
  );
}
