const coreSkills = [
  { label: 'Language', value: 'TypeScript (principal)' },
  { label: 'Frontend', value: 'React, Tailwind CSS' },
  { label: 'Backend', value: 'Node.js, API REST' },
  { label: 'Tooling', value: 'Git, GitHub, Vite' },
]

const suggestedSkills = [
  'Tests (Vitest)',
  'CI/CD (GitHub Actions)',
]

export function Terminal() {
  return (
    <section className="terminal-window h-full overflow-auto px-4 py-3 text-[#e7e8ed]">
      <pre className="m-0 font-mono text-[0.92rem] leading-7">
        <span className="text-[#9aa0b5]">steve@portfolio:~$</span>{' '}
        <span className="text-[#f3f4f8]">npm run dev</span>
        {'\n'}
        <span className="text-[#00d084]">✓ VITE v7.3.1 ready in 589 ms</span>
        {'\n'}
        <span className="text-[#7dd3fc]">➜  Local:</span> http://localhost:5173/
        {'\n\n'}
        <span className="text-[#9aa0b5]">steve@portfolio:~$</span>{' '}
        <span className="text-[#f3f4f8]">skills --current</span>
        {'\n'}
        {coreSkills.map((skill) => (
          <span key={skill.label}>
            <span className="text-[#22d3ee]">{skill.label.padEnd(10, ' ')}</span>
            <span className="text-[#d7dae3]">: {skill.value}</span>
            {'\n'}
          </span>
        ))}
        {'\n'}
        <span className="text-[#9aa0b5]">steve@portfolio:~$</span>{' '}
        <span className="text-[#f3f4f8]">skills --suggested</span>
        {'\n'}
        {suggestedSkills.map((skill) => (
          <span key={skill}>
            <span className="text-[#f59e0b]">•</span> <span className="text-[#d7dae3]">{skill}</span>
            {'\n'}
          </span>
        ))}
        {'\n'}
        <span className="text-[#9aa0b5]">steve@portfolio:~$</span> <span className="animate-pulse">_</span>
      </pre>
    </section>
  )
}
