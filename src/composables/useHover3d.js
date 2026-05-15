export function initHover3dTracking() {
  if (typeof window === 'undefined') return
  if (!window.matchMedia('(pointer: fine)').matches) return

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
  const maxTilt = 9
  const maxLift = -3
  const maxScaleBoost = 0.02

  const reset = (element) => {
    if (!element) return
    element.style.setProperty('--hover3d-rx', '0deg')
    element.style.setProperty('--hover3d-ry', '0deg')
    element.style.setProperty('--hover3d-ty', '0px')
    element.style.setProperty('--hover3d-scale', '1')
  }

  let activeElement = null

  document.addEventListener('pointermove', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('.hover-3d')
      : null

    if (activeElement && activeElement !== target) {
      reset(activeElement)
    }

    if (!target) {
      activeElement = null
      return
    }

    const rect = target.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1)
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1)

    const rx = (0.5 - y) * 2 * maxTilt
    const ry = (x - 0.5) * 2 * maxTilt
    const cornerDistance = Math.hypot(x - 0.5, y - 0.5) / Math.hypot(0.5, 0.5)
    const lift = maxLift * cornerDistance
    const scale = 1 + maxScaleBoost * cornerDistance

    target.style.setProperty('--hover3d-rx', `${rx.toFixed(2)}deg`)
    target.style.setProperty('--hover3d-ry', `${ry.toFixed(2)}deg`)
    target.style.setProperty('--hover3d-ty', `${lift.toFixed(2)}px`)
    target.style.setProperty('--hover3d-scale', scale.toFixed(4))

    activeElement = target
  }, { passive: true })

  document.addEventListener('pointerout', (event) => {
    const fromElement = event.target instanceof Element
      ? event.target.closest('.hover-3d')
      : null
    const toElement = event.relatedTarget instanceof Element
      ? event.relatedTarget.closest('.hover-3d')
      : null

    if (fromElement && fromElement !== toElement) {
      reset(fromElement)
      if (activeElement === fromElement) {
        activeElement = null
      }
    }
  })

  window.addEventListener('blur', () => {
    if (activeElement) {
      reset(activeElement)
      activeElement = null
    }
  })
}