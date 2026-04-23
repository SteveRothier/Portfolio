import alchemixImage from '../assets/projects/Alchemix.png'
import codexImage from '../assets/projects/Codex.png'
import gsapIcon from '../assets/stacks/gsap.svg'
import lucideIcon from '../assets/stacks/lucide.svg'
import reactIcon from '../assets/stacks/react.svg'
import tailwindIcon from '../assets/stacks/tailwind.svg'
import typescriptIcon from '../assets/stacks/typescript.svg'
import viteIcon from '../assets/stacks/vite.svg'
import zustandIcon from '../assets/stacks/zustand.svg'

export type Project = {
  title: string
  description: string
  technologies: string[]
  stackIcons?: { name: string; iconUrl: string }[]
  githubUrl: string
  liveUrl: string
  imageUrl?: string
}

export const projects: Project[] = [
  {
    title: 'Alchemix',
    description:
      'Melange les élements de bases pour créer et decouvrir progressivement des élements toujours plus complexes.',
    technologies: ['React', 'TypeScript', 'Vite', 'Zustand', 'GSAP', 'Tailwind'],
    stackIcons: [
      { name: 'React', iconUrl: reactIcon },
      { name: 'TypeScript', iconUrl: typescriptIcon },
      { name: 'Vite', iconUrl: viteIcon },
      { name: 'Zustand', iconUrl: zustandIcon },
      { name: 'GSAP', iconUrl: gsapIcon },
      { name: 'Tailwind', iconUrl: tailwindIcon },
    ],
    githubUrl: 'https://github.com/SteveRothier/Alchemix',
    liveUrl: 'https://alchemix-ten.vercel.app/#/',
    imageUrl: alchemixImage,
  },
  {
    title: 'Codex',
    description:
      'Grimoire interactif avec animations de pages, exploration de sorts par categories.',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lucide'],
    stackIcons: [
      { name: 'React', iconUrl: reactIcon },
      { name: 'TypeScript', iconUrl: typescriptIcon },
      { name: 'Vite', iconUrl: viteIcon },
      { name: 'GSAP', iconUrl: gsapIcon },
      { name: 'Lucide', iconUrl: lucideIcon },
    ],
    githubUrl: 'https://github.com/SteveRothier/Codex',
    liveUrl: 'https://codex-iota-wheat.vercel.app',
    imageUrl: codexImage,
  },
]
