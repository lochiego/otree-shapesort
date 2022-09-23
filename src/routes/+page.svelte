<script lang="ts">
	import Septagon from '$lib/septagon.svelte';
	import Hexagon from '../lib/hexagon.svelte';
	import Pentagon from '../lib/pentagon.svelte';
	import type { Piece, Point as Transform, Shape, ShapeColor } from '../lib/types';

	export let numShapes: number = 10;
	export let shapeSize: number = 60;
	export let sortBy: 'color' | 'shape' = 'color';
	export const prerender = true;

	const COLOR_RED = 'rgb(225 29 72)';
	const COLOR_BLUE = 'rgb(37 99 235)';
	const COLOR_GREEN = 'rgb(22 163 74)';

	const ID_BUCKET1 = 'bucket1';
	const ID_BUCKET2 = 'bucket2';
	const ID_BUCKET3 = 'bucket3';

	let sandboxWidth: number;
	let sandboxHeight: number;

	function randomShape(): Shape {
		const shapeIdx = Math.round(Math.random() * 2);
		switch (shapeIdx) {
			case 0:
				return Pentagon;
			case 1:
				return Hexagon;
			default:
				return Septagon;
		}
	}

	function randomColor(): ShapeColor {
		const colorKey = Math.round(Math.random() * 3);
		switch (colorKey) {
			case 0:
				return COLOR_RED;
			case 1:
				return COLOR_BLUE;
			default:
				return COLOR_GREEN;
		}
	}

	function getSlotForColor(color: ShapeColor): number {
		switch (color) {
			case COLOR_RED:
				return 0;
			case COLOR_BLUE:
				return 1;
			default:
				return 2;
		}
	}

	$: loaded = sandboxWidth !== undefined;

	let pieces: (Piece & { transform: Transform; targetSlot: number })[];
	$: {
		const maxX = sandboxWidth - shapeSize;
		const maxY = sandboxHeight - shapeSize;

		pieces = !loaded
			? []
			: Array.from(Array(numShapes)).map((_, idx) => {
					const color = randomColor();
					return {
						id: idx,
						Shape: randomShape(),
						color: color,
						targetSlot: getSlotForColor(color),
						transform: {
							x: Math.round(Math.random() * maxX),
							y: Math.round(Math.random() * maxY),
							angle: Math.round(Math.random() * 360)
						}
					};
			  });
	}

	let offsetX: number;
	let offsetY: number;
	let selectedIdx = -1;

	function mouseDown(event: MouseEvent, itemIdx: number) {
		const { top, left } = (event.target as HTMLElement).getBoundingClientRect();
		offsetX = event.clientX - left;
		offsetY = event.clientY - top;
		selectedIdx = itemIdx;

		activeTarget = pieces[itemIdx].targetSlot;
	}

	function mouseUp() {
		selectedIdx = -1;
	}

	function dragStart(event: DragEvent, itemIndex: number) {
		event.dataTransfer!.setData('item', `${itemIndex}`);
		event.dataTransfer!.effectAllowed = 'move';
		event.dataTransfer!.dropEffect = 'move';
		setTimeout(() => (event.target as HTMLElement).classList.add('invisible'), 0);

		// let crt = (event.target as HTMLElement).cloneNode(true) as HTMLElement;
		// crt.id = 'temp';
		// crt.style.visibility = 'hidden'; /* or visibility: hidden, or any of the above */
		// document.body.appendChild(crt);
		// event.dataTransfer?.setDragImage(crt, 0, 0);

		// return false;
	}

	function drag(event: DragEvent, itemIdx: number) {
		event.preventDefault();

		const tick = new Promise(requestAnimationFrame);

		const { pageX: xMove, pageY: yMove } = event;

		if (xMove === 0) {
			return;
		}

		// const el = event.target as HTMLDivElement;

		tick.then(() => {
			const { transform } = pieces[itemIdx];
			transform.x = xMove - offsetX;
			transform.y = yMove - offsetY;
			pieces = pieces;
		});
	}

	function dragEnd(event: DragEvent, itemIdx: number) {
		// let crt = event.dataTransfer?
		setTimeout(() => (event.target as HTMLElement).classList.remove('invisible'), 0);
	}

	// See https://codepen.io/benkalsky/pen/ByJawa for example of desired movement
	// See also https://codepen.io/nuo/pen/nXLvBz

	function drop(event: DragEvent) {
		console.log('dropped', event);
		const dataItemIdx = event.dataTransfer!.getData('item');
		const itemIdx = Number.parseInt(dataItemIdx);

		// TODO: move it over if necessary

		// TODO: remove the dragging class from the item
		hoverOver = undefined;
		activeTarget = -1;
	}

	function handleSubmit() {
		alert('Good job, pat on the back for you.');
	}

	$: sortByColor = sortBy === 'color';

	let hoverOver: string | undefined;
	let activeTarget = -1;
</script>

<main class="w-full h-full flex m-0 p-0">
	<section
		class="flex flex-1 h-full"
		bind:clientWidth={sandboxWidth}
		bind:clientHeight={sandboxHeight}
	>
		{#each pieces as { id, color, Shape, transform }, idx (id)}
			<div
				class="fixed z-10 shape"
				style="--posx:{transform.x}px;--posy:{transform.y}px;--angle:{transform.angle}deg"
				draggable="true"
				on:mousedown={(event) => mouseDown(event, idx)}
				on:dragstart={(event) => dragStart(event, idx)}
				on:drag={(event) => drag(event, idx)}
				on:dragend={(event) => dragEnd(event, idx)}
				on:mouseup={mouseUp}
			>
				<Shape {color} size={shapeSize} />
			</div>
		{/each}
	</section>
	<section class="w-1/6 h-full flex flex-col" on:dragover={(event) => event.preventDefault()}>
		<div
			id={ID_BUCKET1}
			class="flex-1 border flex items-center justify-center bin"
			on:dragover={() => (hoverOver = ID_BUCKET1)}
			class:hovering={activeTarget === 1 && hoverOver === ID_BUCKET1}
			on:dragleave={() => (hoverOver = undefined)}
			on:drop={(event) => drop(event)}
		>
			{#if !sortByColor}
				<Pentagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-green-900 opacity-70" />
			{/if}
		</div>
		<div
			id="bucket2"
			class="flex-1 h-full border flex items-center justify-center bin"
			on:dragover={() => (hoverOver = ID_BUCKET2)}
			class:hovering={activeTarget === 2 && hoverOver === ID_BUCKET2}
			on:dragleave={() => (hoverOver = undefined)}
			on:drop={(event) => drop(event)}
		>
			{#if !sortByColor}
				<Hexagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-blue-900 opacity-70" />
			{/if}
		</div>
		<div id="bucket3" class="flex-1 border flex items-center justify-center bin">
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
	@mixin grab-cursor {
		cursor: url('https://www.google.com/intl/en_ALL/mapfiles/openhand.cur'), all-scroll;
		cursor: -webkit-grab;
		cursor: -moz-grab;
		cursor: -o-grab;
		cursor: -ms-grab;
		cursor: grab;
	}

	@mixin grabbing-cursor {
		cursor: url('https://www.google.com/intl/en_ALL/mapfiles/closedhand.cur'), all-scroll;
		cursor: -webkit-grabbing;
		cursor: -moz-grabbing;
		cursor: -o-grabbing;
		cursor: -ms-grabbing;
		cursor: grabbing;
	}

	.hovering {
		opacity: 0.3;
	}

	.shape {
		$transform: translate(var(--posx), var(--posy)) rotate(var(--angle));

		// left: var(--posx);
		// top: var(--posy);

		transform: $transform;
		-ms-transform: $transform; /* IE 9 */
		-webkit-transform: $transform; /* Safari and Chrome */
		-o-transform: $transform; /* Opera */
		-moz-transform: $transform; /* Firefox */

		transition: all 0.8 ease;

		// position: fixed;
		display: inline-block;

		@include grab-cursor;

		&:active {
			@include grabbing-cursor;
		}
	}
</style>
