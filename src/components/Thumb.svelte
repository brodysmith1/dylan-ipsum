<script>
import { createEventDispatcher } from "svelte"
import { clamp } from "../../scripts/utils.js"
import { drag } from "../../scripts/drag.js"

const dispatch = createEventDispatcher()

export let v
export let id

let active

const onEnd = () => {
  active = false
  dispatch('end')
}
  
</script>

<div
  use:drag
  class:active
  class="thumb"
  style={`left: ${v}%;`}
  on:end={onEnd}
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
  border: 1px solid;
  cursor: grab;
}
  
.thumb.active {
  cursor: grabbing;
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
  transition: all .3s;
}
  
.thumb:hover:before {
  background: #ffffff44
}
  
.thumb.active:before {
  background: #3df599;
  transform: scale(1.5)
}
  
</style>
