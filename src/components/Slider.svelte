<script>

import Thumb from "./Thumb.svelte"

export let id
export let min = 0
export let max = 100
export let track = [0, 100]

const fx = v => 100 * (v - track[0]) / (track[1] - track[0])
const inv_fx = v => +((track[0] + 0.01 * v * (track[1] - track[0]))).toFixed(0)

let a = fx(track[0])
let b = fx(track[1])

$: style = a < b ?
  `left: ${a}%; right: ${100 - b}%` :
  `left: ${b}%; right: ${100 - a}%`

$: min = inv_fx(Math.min(a,b))
$: max = inv_fx(Math.max(a,b))

</script>

<div class="slider-wrap">
  <div class="slider-track">
    <div class="slider-range" {style}></div>
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
  margin: 0.75rem;
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
  background: white;
  position: absolute;
}

</style>
