import { projects } from '../data/projects'

export function Projects() {
  return (
    <section className="projects-window p-3 md:p-3.5">
      <div className="projects-window__grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            className="project-tile overflow-hidden rounded-md border border-line-soft bg-[rgba(9,15,29,0.88)]"
            key={project.title}
          >
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="project-tile__media block aspect-video no-underline"
              aria-label={`Ouvrir ${project.title}`}
            >
              {project.imageUrl ? (
                <img className="h-full w-full object-cover" src={project.imageUrl} alt={project.title} />
              ) : (
                <span className="project-tile__fallback grid h-full place-items-center text-text-main">
                  {project.title}
                </span>
              )}
            </a>
            <div className="project-tile__body grid gap-2 p-2.5 md:p-3">
              <h3 className="m-0 text-[0.95rem] font-semibold">{project.title}</h3>
              <p className="m-0 text-[0.8rem] text-text-soft">{project.description}</p>
              <div className="project-tile__links flex flex-wrap gap-2">
                <a
                  className="rounded-full border border-line-soft px-2 py-1 text-[0.74rem] text-text-main no-underline"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="rounded-full border border-line-soft px-2 py-1 text-[0.74rem] text-text-main no-underline"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
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
