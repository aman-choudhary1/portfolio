import { BrowserRouter } from 'react-router-dom';

import { About, Contact, Experience, Education, Hero, Navbar, Tech, Works, Footer, StarsCanvas } from './components'

const App = () => {
  return (
    <BrowserRouter>
     <div className='relative z-0 bg-primary'>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Tech />
      <Works />
      <div className='relative z-0'>
        <Contact />
        <StarsCanvas />
      </div>
      <Footer />
     </div>
    </BrowserRouter>
  )
}

export default App
