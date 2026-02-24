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
  MouseGlow,
  StarsCanvas,
} from './components';

/* CSS-only wave divider — no extra WebGL context */
const WaveDivider = () => (
  <div className="relative w-full h-[80px] overflow-hidden">
    <div className="wave-divider" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        {/* Global cursor glow (CSS only, no WebGL) */}
        <MouseGlow />

        {/* Navigation */}
        <Navbar />

        {/* Hero — Canvas #1: HeroScene */}
        <Hero />

        {/* CSS Wave Divider */}
        <WaveDivider />

        {/* About */}
        <About />

        {/* Experience */}
        <Experience />

        {/* CSS Wave Divider */}
        <WaveDivider />

        {/* Education */}
        <Education />

        {/* Skills — Canvas #2: NeuralNetwork + Canvas #3-13: Balls */}
        <Tech />

        {/* CSS Wave Divider */}
        <WaveDivider />

        {/* Projects */}
        <Works />

        {/* Contact — Canvas #14: Earth + Canvas #15: Stars */}
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
