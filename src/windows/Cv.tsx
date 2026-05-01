import resumePdf from '../assets/cv/resume.pdf'

export function Cv() {
  return (
    <section className="h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-hidden">
        <object
          data={`${resumePdf}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
          type="application/pdf"
          aria-label="CV PDF"
          className="pointer-events-none block h-full w-full select-none"
        >
          <p className="p-4 text-sm text-text-soft">
            Aperçu non disponible. Ouvre le PDF avec le bouton de téléchargement.
          </p>
        </object>
      </div>
    </section>
  )
}
