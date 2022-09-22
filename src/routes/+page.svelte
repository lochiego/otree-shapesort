<script lang="ts">
	import Septagon from "$lib/septagon.svelte";
	import Hexagon from "../lib/hexagon.svelte";
	import Pentagon from "../lib/pentagon.svelte";
	import type { Piece, Point as Transform, Shape, ShapeColor } from "../lib/types";

  export let numShapes: number = 10;
  export let shapeSize: number = 60;
  export let sortBy: 'color' | 'shape' = 'color';
  export const prerender = true;

  const ID_BUCKET1 = "bucket1";
  const ID_BUCKET2 = "bucket2";
  const ID_BUCKET3 = "bucket3";

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
      case 0: return 'rgb(225 29 72)';
      case 1: return 'rgb(37 99 235)';
      default: return 'rgb(22 163 74)';
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
    transforms = !loaded ? [] : pieces.map(() => ({
      x: Math.round(Math.random() * maxX),
      y: Math.round(Math.random() * maxY),
      angle: Math.round((Math.random() * 360)),
    }))
  }


  function dragStart(event: DragEvent, itemIndex: number) {
    event.dataTransfer!.setData('item', `${itemIndex}`);
  }

  // See https://codepen.io/benkalsky/pen/ByJawa for example of desired movement

  function drop(event: DragEvent) {
    event.preventDefault();
    const dataItemIdx = event.dataTransfer!.getData("item");
    const itemIdx = Number.parseInt(dataItemIdx);
      
    // TODO: move it over
    // event
  }



  function handleSubmit() {
    alert("Good job, pat on the back for you.");
  }

  $: sortByColor = sortBy === 'color';

  let hoverOver: string | undefined;

</script>

<main class="w-full h-full flex m-0 p-0">
  <section class="flex flex-1 h-full" bind:clientWidth={sandboxWidth} bind:clientHeight={sandboxHeight}>
    {#each pieces as {id, color, Shape}, idx (id)}
      <div class="fixed top-0 left-0 shape"
       style="--posx:{transforms[idx].x}px;--posy:{transforms[idx].y}px;--angle:{transforms[idx].angle}deg"
       draggable="true"
       on:dragstart={event => dragStart(event, idx)}
      >
        <Shape {color} size={shapeSize} />
      </div>
    {/each}
  </section>
  <section class="w-1/6 h-full flex flex-col">
    <div 
      id={ID_BUCKET1} 
      class="flex-1 border flex items-center justify-center" 
      on:dragenter={() => hoverOver = ID_BUCKET1}
      class:hovering={hoverOver === ID_BUCKET1}
      on:dragexit={() => hoverOver = undefined}
      on:drop={event => drop(event)}
    >
      {#if !sortByColor}
        <Pentagon color="#a0a0a0" size={80} />
      {:else}
        <div class="w-full h-full bg-green-900 opacity-70" />
      {/if}
    </div>
    <div id="bucket2" class="flex-1 h-full border flex items-center justify-center">
      {#if !sortByColor}
        <Hexagon color="#a0a0a0" size={80} />
      {:else}
        <div class="w-full h-full bg-blue-900 opacity-70" />
      {/if}
    </div>
    <div id="bucket3" class="flex-1 border flex items-center justify-center">
      {#if !sortByColor}
        <Septagon color="#a0a0a0" size={80} />
      {:else}
        <div class="w-full h-full bg-red-900 opacity-70" />
      {/if}
    </div>
    <div id="submit" class="border flex items-stretch">
      <button class="flex-1 p-9" on:click={handleSubmit}>Submit</button>
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