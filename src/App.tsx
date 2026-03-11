import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { CallToAction } from './components/CallToAction';
import { SocialFooter } from './components/SocialFooter';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <CatalogSection />
      <CallToAction />
      <SocialFooter />
    </div>
  );
}