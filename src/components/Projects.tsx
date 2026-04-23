import { projects } from '../data/projects'
import githubIcon from '../assets/stacks/github.svg'
import ThreeDCard from './ThreeDCard'

export default function Projects() {
  const handleOpenLive = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="projects">
      <div className="projects-grid">
        {projects.map((project) => (
          <ThreeDCard className="project-card-tilt" key={project.title} maxRotation={4.5} parallaxOffset={0}>
            <article className="project-card">
              <a
                className="project-media"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Ouvrir ${project.title}`}
                onClick={(e) => {
                  e.preventDefault()
                  handleOpenLive(project.liveUrl)
                }}
              >
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} />
                ) : (
                  <div className="project-media-fallback">{project.title}</div>
                )}
                <span className="project-media-hover-label">Ouvrir</span>
              </a>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta-row">
                  <div className="project-techs">
                    {project.stackIcons?.length
                      ? project.stackIcons.map((stack) => (
                          <span className="project-tech-icon" key={`${project.title}-${stack.name}`} title={stack.name}>
                            <img src={stack.iconUrl} alt={stack.name} />
                          </span>
                        ))
                      : project.technologies.map((tech) => <span className="project-tech-text" key={`${project.title}-${tech}`}>{tech}</span>)}
                  </div>
                  <a className="project-github-link" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`GitHub ${project.title}`}>
                    <img src={githubIcon} alt="GitHub" />
                  </a>
                </div>
              </div>
            </article>
          </ThreeDCard>
        ))}
      </div>
    </section>
  )
}
