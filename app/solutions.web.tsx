import { ArtefactFrame } from '../src/components/marketing/ArtefactFrame.web';

/** Solutions + Industry Playbook artefact — framed with shared top bar. */
export default function SolutionsScreen() {
  return (
    <ArtefactFrame
      activeHref="/solutions"
      title="AiKOVA — Solutions + Industry Playbook"
      src="/solutions-playbook/index.html"
    />
  );
}
