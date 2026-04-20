export type Project = {
  title: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  imageUrl?: string
}

export const projects: Project[] = [
  {
    title: 'Portfolio Personnel',
    description:
      'Portfolio responsive avec sections recruteur, design moderne et animations progressives.',
    technologies: ['React', 'TypeScript', 'Vite', 'Framer Motion'],
    githubUrl: 'https://github.com/ton-profil/portfolio',
    liveUrl: 'https://portfolio-demo.vercel.app',
  },
  {
    title: 'Dashboard Analytics',
    description:
      'Tableau de bord orienté data avec filtres dynamiques et visualisation claire des indicateurs.',
    technologies: ['React', 'TypeScript', 'Tailwind', 'Chart.js'],
    githubUrl: 'https://github.com/ton-profil/dashboard-analytics',
    liveUrl: 'https://dashboard-demo.vercel.app',
  },
  {
    title: 'API Tasks Manager',
    description:
      'Application full-stack pour gérer des taches avec authentification et persistence de donnees.',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    githubUrl: 'https://github.com/ton-profil/tasks-manager',
    liveUrl: 'https://tasks-demo.vercel.app',
  },
]
