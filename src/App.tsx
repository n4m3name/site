import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Kind from './pages/Kind'
import Category from './pages/Category'
import Post from './pages/Post'
import AboutMe from './pages/AboutMe'
import GlobalFx from './components/GlobalFx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Kind kind="research" />} />
        <Route path="/projects" element={<Kind kind="projects" />} />
        <Route path="/audio" element={<Kind kind="audio" />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/:kind/:category" element={<Category />} />
        <Route path="/:kind/:category/:slug" element={<Post />} />
      </Routes>
      <GlobalFx />
    </BrowserRouter>
  )
}

export default App
