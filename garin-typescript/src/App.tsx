import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Parasha from './pages/Parasha'
import TorahPost from './pages/TorahPost'
import News from './pages/News'
import Education from './pages/Education'
import Mechina from './pages/Mechina'
import SherutLeumi from './pages/SherutLeumi'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/parasha" element={<Parasha />} />
            <Route path="/parasha/:id" element={<TorahPost />} />
            <Route path="/news" element={<News />} />
            <Route path="/education" element={<Education />} />
            <Route path="/mechina" element={<Mechina />} />
            <Route path="/sherut-leumi" element={<SherutLeumi />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
