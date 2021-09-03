import { on, rect, clamp } from "./utils.js"

export const drag = (node) => {
  let x, v
  let track = rect(node.parentElement)
  let listeners = []
  
  const fx = vx => 100 * (vx - track.left) / track.width
  
  const start = (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    document.body.classList.add("dragging")
    listeners.push(on(window, 'pointermove', move))
    listeners.push(on(window, 'pointerup',   end))
    node.dispatchEvent(new CustomEvent('start', {
      detail: fx(e.clientX)
    }))
  }

  const move = (e) => {
    node.dispatchEvent(new CustomEvent('move', {
      detail: fx(e.clientX)
    }))
  }
    
  const end = (e) => {
    listeners.forEach(off => off())
    document.body.classList.remove("dragging")
    node.dispatchEvent(new CustomEvent('end', {
      detail: fx(e.clientX)
    }))
  }

  let cleanup = [
    on(node, 'pointerdown', start),
    on(node, 'touchstart', start)
  ]

	return {
    destroy() { cleanup.forEach(off => off()) }
  }
}
