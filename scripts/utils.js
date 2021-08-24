let call = (xs, fn) => [].concat(xs).map(fn)

let events = (action) => (xs, e, fn) =>
  call(xs, (x) => x[`${action}EventListener`](e, fn))
  
export let on = (x, ev, fn) => {
  events('add')(x, ev, fn)
  return () => events('remove')(x, ev, fn)
}

export let clamp = (value, min = 0, max = 100) =>
  value < min ? min : value > max ? max : value

export let rect = (el) =>
  el && typeof el.getBoundingClientRect === 'function'
    ? el.getBoundingClientRect()
    : null

export const rand = n => Math.floor(Math.random() * n)
export const sample = arr => arr[rand(arr.length)]
export const between = (a,b,v) => v >= a && v <= b
