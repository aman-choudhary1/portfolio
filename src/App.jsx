import { BrowserRouter } from 'react-router-dom';

import {
  About,
  Contact,
  Experience,
  Education,
  Hero,
  Navbar,
  Tech,
  Works,
  Footer,
} from './components';
import FuturisticCursor from './components/FuturisticCursor';
import GlobalSceneCanvas from './components/canvas/GlobalScene';
import Highlights from './components/Highlights';
import Terminal from './components/Terminal';
import Preloader from './components/Preloader';
import useSmoothScroll from './utils/useSmoothScroll';
import CommandPalette from './components/CommandPalette';

/* CSS-only section divider */
const SectionDivider = () => (
  <div className="relative w-full h-px my-6 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
);

const App = () => {
  useSmoothScroll();

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        {/* Futuristic cursor (CSS + Canvas, no WebGL) */}
        <FuturisticCursor />

        {/* Scroll-driven 3D computer */}
        <GlobalSceneCanvas />

        <Preloader />
        <CommandPalette />
        <Terminal />

        {/* Navigation */}
        <Navbar />

        {/* Hero — Canvas #2: HeroScene */}
        <Hero />

        <SectionDivider />
        <About />

        <Highlights />

        <Experience />

        <SectionDivider />
        <Education />

        {/* Skills — Canvas #3: NeuralNetwork */}
        <Tech />

        <SectionDivider />
        <Works />

        {/* Contact — Canvas #4: Earth */}
        <div className='relative z-0'>
          <Contact />
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
