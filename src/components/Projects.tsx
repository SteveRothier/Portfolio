import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects">
      <h2>Projects</h2>
      <p>Selection de projets avec stack et liens utiles.</p>
      <div className="projects-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.title}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>
              <strong>Tech:</strong> {project.technologies.join(', ')}
            </p>
            <div className="project-links">
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                Live
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
