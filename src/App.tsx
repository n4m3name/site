import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Kind from './pages/Kind'
import Category from './pages/Category'
import Post from './pages/Post'
import AboutMe from './pages/AboutMe'
import Terminal from './pages/Terminal'
import NotFound from './pages/NotFound'
import Void from './pages/Void'
import GlobalFx from './components/GlobalFx'

function App() {
  return (
    <BrowserRouter>
      {/* GlitchBurst distorts #page-content via Element.animate(); keep GlobalFx outside so its overlay doesn't get distorted too. */}
      <div id="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Kind kind="research" />} />
          <Route path="/projects" element={<Kind kind="projects" />} />
          <Route path="/audio" element={<Kind kind="audio" />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/void" element={<Void />} />
          <Route path="/:kind/:category" element={<Category />} />
          <Route path="/:kind/:category/:slug" element={<Post />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <GlobalFx />
    </BrowserRouter>
  )
}

export default App
