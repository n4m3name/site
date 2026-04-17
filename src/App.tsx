import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Kind from './pages/Kind'
import Category from './pages/Category'
import Post from './pages/Post'
import AboutMe from './pages/AboutMe'
import Terminal from './pages/Terminal'
import GlobalFx from './components/GlobalFx'

function App() {
  return (
    <BrowserRouter>
      <div id="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Kind kind="research" />} />
          <Route path="/projects" element={<Kind kind="projects" />} />
          <Route path="/audio" element={<Kind kind="audio" />} />
          <Route path="/about-me" element={<AboutMe />} />
          <Route path="/:kind/:category" element={<Category />} />
          <Route path="/:kind/:category/:slug" element={<Post />} />
          <Route path="/terminal" element={<Terminal />} />
        </Routes>
      </div>
      <GlobalFx />
    </BrowserRouter>
  )
}

export default App
