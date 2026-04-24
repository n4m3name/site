export function wiggle(el: HTMLElement | null | undefined) {
  if (!el) return
  el.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(3px)' },
      { transform: 'translateX(-1px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 180, easing: 'ease-out' },
  )
}
