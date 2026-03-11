import { Hero } from '../components/Hero';
import { CatalogSection } from '../components/CatalogSection';
import { CallToAction } from '../components/CallToAction';
import { SocialFooter } from '../components/SocialFooter';

export function Home() {
  return (
    <>
      <Hero />
      <CatalogSection />
      <CallToAction />
      <SocialFooter />
    </>
  );
}
