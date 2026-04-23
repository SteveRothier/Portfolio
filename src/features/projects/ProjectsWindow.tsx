import { projects } from '../../data/projects'

export function ProjectsWindow() {
  return (
    <section className="projects-window">
      <div className="projects-window__grid">
        {projects.map((project) => (
          <article className="project-tile" key={project.title}>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-tile__media"
              aria-label={`Ouvrir ${project.title}`}
            >
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} />
              ) : (
                <span className="project-tile__fallback">{project.title}</span>
              )}
            </a>
            <div className="project-tile__body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tile__links">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Live
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
