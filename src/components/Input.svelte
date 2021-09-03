<script>
  export let label
  export let range
  export let className
</script>

<div class="py-4 flex-col flex-center text-center {className}">
  <label for={label}>{label}</label>
  <slot></slot>
  {#if range}
    <div class="range">{range}</div>
  {/if}
</div>
