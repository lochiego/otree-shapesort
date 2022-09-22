<script lang="ts">
	import Septagon from "$lib/septagon.svelte";
	import Hexagon from "../lib/hexagon.svelte";
	import Pentagon from "../lib/pentagon.svelte";
	import type { Piece, Point as Transform, Shape, ShapeColor } from "../lib/types";

  export let numShapes: number = 10;
  export let shapeSize: number = 60;
  export const prerender = true;

  let sandboxWidth: number;
  let sandboxHeight: number;

  function randomShape(): Shape {
    const shapeIdx = Math.round((Math.random() * 2));
    switch (shapeIdx) {
      case 0: return Pentagon;
      case 1: return Hexagon;
      default: return Septagon;
    }
  }

  function randomColor(): ShapeColor {
    const colorKey = Math.round((Math.random() * 3));
    switch (colorKey) {
      case 0: return 'red';
      case 1: return 'blue';
      default: return 'green';
    }
  }

  $: loaded = sandboxWidth !== undefined;

  let pieces: Piece[];
  $: {
    pieces = !loaded ? [] : Array.from(Array(numShapes)).map((_, idx) => {
      return {
        id: idx,
        Shape: randomShape(),
        color: randomColor(),
      }
    })
  }
  let transforms: Transform[];
  $: {
    const maxX = sandboxWidth - shapeSize;
    const maxY = sandboxHeight - shapeSize;
    console.log('max Y', maxY);
    transforms = !loaded ? [] : pieces.map(() => ({
      x: Math.round(Math.random() * maxX),
      y: Math.round(Math.random() * maxY),
      angle: Math.round((Math.random() * 360)),
    }))
  }

  function handleSubmit() {
    alert("Good job, pat on the back for you.");
  }

</script>

<main class="w-full h-full flex m-0 p-0">
  <section class="flex flex-1 h-full" bind:clientWidth={sandboxWidth} bind:clientHeight={sandboxHeight}>
    {#each pieces as {id, color, Shape}, idx (id)}
      <div class="fixed top-0 left-0 shape" style="--posx:{transforms[idx].x}px;--posy:{transforms[idx].y}px;--angle:{transforms[idx].angle}deg">
        <Shape class="shape" {color} size={shapeSize} />
      </div>
    {/each}
  </section>
  <section class="w-1/6">
    <div id="bucket1"></div>
    <div id="bucket2"></div>
    <div id="bucket3"></div>
    <div id="submit">
      <!-- <button on:click={handleSubmit}>Submit</button> -->
    </div>
  </section>
</main>

<style lang="scss">
  
  .shape {
    $translation: translate(var(--posx), var(--posy)) rotate(var(--angle));

    transform: $translation;
    -ms-transform: translation; /* IE 9 */
    -webkit-transform: translation; /* Safari and Chrome */
    -o-transform: translation; /* Opera */
    -moz-transform: translation; /* Firefox */

    position: absolute;
    display: inline-block;
  }
</style>