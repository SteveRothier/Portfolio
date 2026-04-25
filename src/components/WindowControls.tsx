type WindowControlsProps = {
  onMinimize: () => void
  onToggleMaximize: () => void
  onClose: () => void
}

export function WindowControls({ onMinimize, onToggleMaximize, onClose }: WindowControlsProps) {
  return (
    <div className="desktop-window__controls flex items-center gap-1" aria-hidden>
      <button
        type="button"
        className="control control--min"
        aria-label="Minimiser la fenêtre"
        onClick={onMinimize}
        onPointerDown={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        className="control control--max"
        aria-label="Maximiser ou restaurer la fenêtre"
        onClick={onToggleMaximize}
        onPointerDown={(event) => event.stopPropagation()}
      />
      <button
        type="button"
        className="control control--close"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
        onPointerDown={(event) => event.stopPropagation()}
      />
    </div>
  )
}
