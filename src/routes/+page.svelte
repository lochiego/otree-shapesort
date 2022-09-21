<script lang="ts">
	import Hexagon from "../lib/hexagon.svelte";
	import Pentagon from "../lib/pentagon.svelte";
	import Square from "../lib/square.svelte";
	import type { Piece, Point, Shape, ShapeColor } from "../lib/types";

  export let numShapes: number = 10;
  export const prerender = true;

  let width: number;
  let height: number;
  const sidePaneWidth = 200;

  function randomShape(): Shape {
    const shapeIdx = Math.round((Math.random() * 4));
      switch (shapeIdx) {
        case 0: return Square;
        case 1: return Pentagon;
        default: return Hexagon;
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

  $: loaded = width !== undefined;

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
  let positions: Point[];
  $: {
    positions = !loaded ? [] : pieces.map(() => ({
      x: Math.round((Math.random() * (width - sidePaneWidth))),
      y: Math.round((Math.random() * height)),
    }))
  }

  function handleSubmit() {
    alert("Good job, pat on the back for you.");
  }

</script>

<main>
  <section id="workspace" bind:clientWidth={width} bind:clientHeight={height}>
    {#each pieces as {id, color, Shape}, idx (id)}
      <div class="shape" style="--posx:{positions[idx].x}px;--posy:{positions[idx].y}px">
        <Shape class="shape" {color} />
      </div>
    {/each}
  </section>
  <section id="bins">
    <div id="bucket1"></div>
    <div id="bucket2"></div>
    <div id="bucket3"></div>
    <div id="submit">
      <button on:click={handleSubmit}>Submit</button>
    </div>
  </section>
</main>

<style lang="scss">
  
  main {
    max-width: 800px;
    height: 100%;
    display: flex;
    align-items: stretch;
  }

  #workspace {
    flex: 1;
  }

  #bins {
    width: 200px;
  }


    $translation: translate(var(--posx), var(--posy));
    
  .shape {
    transform: $translation;
    -ms-transform: translation; /* IE 9 */
    -webkit-transform: translation; /* Safari and Chrome */
    -o-transform: translation; /* Opera */
    -moz-transform: translation; /* Firefox */

    position: absolute;
    display: inline-block;
  }
</style>