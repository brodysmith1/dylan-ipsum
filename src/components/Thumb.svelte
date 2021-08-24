<script>
import { on, rect, clamp } from "../../scripts/utils.js"
import { createEventDispatcher } from 'svelte';

export let v
export let id

let active

const dispatch = createEventDispatcher()

const drag = (node) => {
  
  let x, v
  let track = rect(node.parentElement)
  let listeners = []
  
  const start = (e) => {
    x = e.clientX
    active = true
    document.body.style.userSelect = "none"
    
    node.dispatchEvent(new CustomEvent('start'))
    listeners.push(on(window, 'mousemove', move))
    listeners.push(on(window, 'mouseup',   end))
  }

  const move = (e) => {
    x = e.clientX
    v = 100 * (x - track.left) / track.width
    node.dispatchEvent(new CustomEvent('move', {detail: v}))
  }
    
  const end = (e) => {
    x = e.clientX
    active = false
    dispatch('end', {x, id})
    listeners.forEach(off => off())
    document.body.style.userSelect = "auto"
    node.dispatchEvent(new CustomEvent('end'))
  }

  let off = on(node, 'mousedown', start)

	return {
    destroy() { off() }
  }
}
  
</script>

<div
  use:drag
  class:active
  class="thumb"
  style={`left: ${v}%;`}
  on:start={() => active = true}
  on:move={({detail: x}) => v = clamp(x)}
>
</div>

<style>
.thumb {
  padding: .75rem;
  background: #9f3b53;
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, 0);
  border: 1px solid
}

.thumb:before {
  content: '';
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  position: absolute;
  background: inherit;
  border-radius: inherit;
  transition: transform .3s;
}
  
.thumb:hover:before {
  transform: scale(1.25)
}
  
.thumb.active:before {
  background: #3df599
}
  
.thumb.active:before {
  transform: scale(1.5)
}
  
</style>
