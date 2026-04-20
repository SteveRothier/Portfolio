import Contact from './components/Contact'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Skills from './components/Skills'

export default function App() {
  return (
    <main className="app">
      <header className="topbar">
        <a href="#hero">Hero</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </header>

      <div className="page-container">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </main>
  )
}
