import { DesktopExperience } from '../features/desktop/DesktopExperience'

export function AppShell() {
  return (
    <main className="app-shell min-h-dvh bg-bg-main text-text-main antialiased">
      <DesktopExperience />
    </main>
  )
}
