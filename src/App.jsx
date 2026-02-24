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

/* CSS-only section divider */
const SectionDivider = () => (
  <div className="relative w-full h-[60px] overflow-hidden">
    <div className="wave-divider" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        {/* Futuristic cursor (CSS + Canvas, no WebGL) */}
        <FuturisticCursor />

        {/* Global scroll-reactive 3D scene — Canvas #1 */}
        <GlobalSceneCanvas />

        {/* Navigation */}
        <Navbar />

        {/* Hero — Canvas #2: HeroScene */}
        <Hero />

        <SectionDivider />
        <About />

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
