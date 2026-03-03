import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import AccessibilityWidget from './components/AccessibilityWidget'
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
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AccessibilityWidget />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow">
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
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
