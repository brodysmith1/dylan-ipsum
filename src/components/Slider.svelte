<script>
import { createEventDispatcher } from "svelte"
import { clamp, between } from "../../scripts/utils.js"
import { drag } from "../../scripts/drag.js"

import Thumb from "./Thumb.svelte"

const dispatch = createEventDispatcher()

export let id
export let min = 0
export let max = 100
export let track = [0, 100]

const fx = v => 100 * (v - track[0]) / (track[1] - track[0])
const inv_fx = v => +((track[0] + 0.01 * v * (track[1] - track[0]))).toFixed(0)

let a  = fx(track[0])
let b  = fx(track[1])
let x0 = 0

$: min = inv_fx(Math.min(a,b))
$: max = inv_fx(Math.max(a,b))

$: style = a < b ?
  `left: ${a}%; right: ${100 - b}%` :
  `left: ${b}%; right: ${100 - a}%`

const onStart = ({detail: x}) => {
  x0 = x
}

const onMove = ({detail: x}) => {
  const dx = x - x0
  if (
    between(0, 100, a + dx) &&
    between(0, 100, b + dx)
  ) {
    a += dx
    b += dx
    x0 += dx
  }
}

const onEnd = ({detail: x}) => {
  x0 = 0
  dispatch('end')
}
  
</script>

<div class="slider-wrap">
  <div class="slider-track" >
    <div
      {style}
      use:drag
      class:active={x0}
      class="slider-range"
      on:start={onStart}
      on:move={onMove}
      on:end={onEnd}
    ></div>
  </div>
  <Thumb {id} bind:v={a} on:end />
  <Thumb {id} bind:v={b} on:end />
</div>

<style>

.slider-wrap {
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  margin: .75rem;
}
  
.slider-track {
  width: 100%;
  background: #ffffff55;
  padding: .25rem 0;
  position: relative;
}
  
.slider-range {
  top: 0;
  bottom: 0;
  cursor: grab;
  background: white;
  position: absolute;
  transition: transform .3s, background .3s;
}
  
.slider-range.active {
  transform: scaleY(1.25);
  cursor: grabbing
}

</style>
