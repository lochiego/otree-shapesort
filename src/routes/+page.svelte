<script lang="ts">
	import Hexagon from "../lib/hexagon.svelte";
	import Square from "../lib/square.svelte";
	import Pentagon from "../lib/pentagon.svelte";
  import type { Piece, Shape, ShapeColor } from "src/lib/types";

  export let numShapes: number = 10;
  export const prerender = true;

  let width: number;
  let height: number;
  const sidePaneWidth = 200;

  function randomShape(): Shape {
    const shapeIdx = Math.round((Math.random() * 4));
      switch (shapeIdx) {
        case 0: return 'square';
        case 1: return 'rectangle';
        default: return 'pentagon';
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
    pieces = !loaded ? [] : Array.from(Array(5)).map((_, idx) => {
      return {
        id: idx,
        shape: randomShape(),
        color: randomColor(),
      }
    })
  }
  let positions: {x: number, y: number}[];
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

<main bind:clientWidth={width} bind:clientHeight={height}>
  <section id="workspace">
    {#each pieces as piece(piece.id)}
      {#if piece.shape === "square"}
        <Square color={piece.color} />
      {:else if piece.shape === 'pentagon'}
        <Pentagon color={piece.color} />
      {:else}
        <Hexagon color={piece.color} />
      {/if}
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