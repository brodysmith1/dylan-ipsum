<script>
  import { fade } from 'svelte/transition'
  export let close
</script>

<div
  class="modal-screen"
  on:click={close}
  transition:fade={{duration: 150}}
>
  <div
    class="modal red scroller"
    on:click|stopPropagation
  >
    <div class="scroller-inner">
      <slot></slot>
    </div>
  </div>
</div>

<style>

.modal-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6)
}
  
.modal {
  flex: unset;
  width: 700px;
  max-width: 95vw;
  max-height: 80vh;
  padding: 1.5rem 2.5rem;
  box-shadow: 5px 5px 30px #0006;
}
  
.red {
  color: white;
  background: #9a314a;
}
  
.scroller-inner {
  position: relative
}

</style>
