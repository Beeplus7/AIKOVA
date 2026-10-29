import { ArtefactFrame } from '../src/components/marketing/ArtefactFrame.web';

/** Portfolio OS Built — framed artefact with shared top bar. */
export default function PortfolioScreen() {
  return (
    <ArtefactFrame
      activeHref="/portfolio"
      title="AiKOVA — Portfolio OS"
      src="/portfolio-os/index.html"
    />
  );
}
