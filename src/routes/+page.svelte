<script lang="ts">
	/* ============
	 * Imports
	 * ============ */
	import Septagon from '$lib/septagon.svelte';
	import Hexagon from '../lib/hexagon.svelte';
	import Pentagon from '../lib/pentagon.svelte';
	import type { Piece, Point as Transform, Shape, ShapeColor } from '../lib/types';
	import { draggable } from '@neodrag/svelte';

	/* ============
	 * API
	 * ============ */
	export let numShapes: number = 10;
	export let shapeSize: number = 60;
	export let sortBy: 'color' | 'shape' = 'color';
	export const prerender = true;

	/* ============
	 * Constants
	 * ============ */
	const COLOR_RED = 'rgb(225 29 72)';
	const COLOR_BLUE = 'rgb(37 99 235)';
	const COLOR_GREEN = 'rgb(22 163 74)';

	const ID_BUCKET1 = 'bucket1';
	const ID_BUCKET2 = 'bucket2';
	const ID_BUCKET3 = 'bucket3';

	/* ============
	 * Logic
	 * ============ */

	/* ------------
	 * Bin and shape configuration
	 * ------------ */

	function randomBin(): number {
		return Math.round(Math.random() * 2);
	}

	function shapeForBin(bin: number): Shape {
		switch (bin) {
			case 0:
				return Pentagon;
			case 1:
				return Hexagon;
			default:
				return Septagon;
		}
	}

	function randomShape(): Shape {
		return shapeForBin(randomBin());
	}

	function colorForBin(bin: number): ShapeColor {
		switch (bin) {
			case 0:
				return COLOR_RED;
			case 1:
				return COLOR_BLUE;
			default:
				return COLOR_GREEN;
		}
	}

	function randomColor(): ShapeColor {
		return colorForBin(randomBin());
	}

	/* ------------
	 * Gameboard setup
	 * ------------ */
	let sandboxWidth: number;
	let sandboxHeight: number;

	$: loaded = sandboxWidth !== undefined;

	let pieces: (Piece & { initialTransform: Transform; targetSlot: number })[];
	$: {
		const maxX = sandboxWidth - shapeSize;
		const maxY = sandboxHeight - shapeSize;

		pieces = !loaded
			? []
			: Array.from(Array(numShapes)).map((_, idx) => {
					const bin = randomBin();
					const [color, shape] =
						sortBy === 'color'
							? [colorForBin(bin), randomShape()]
							: [randomColor(), shapeForBin(bin)];

					return {
						id: idx,
						Shape: shape,
						color: color,
						targetSlot: bin,
						initialTransform: {
							x: Math.round(Math.random() * maxX),
							y: Math.round(Math.random() * maxY),
							angle: Math.round(Math.random() * 360)
						}
					};
			  });
	}

	function getBinEl(bin: number): HTMLElement {
		let bucketId: string;
		switch (bin) {
			case 0:
				bucketId = ID_BUCKET1;
			case 1:
				bucketId = ID_BUCKET2;
			default:
				bucketId = ID_BUCKET3;
		}

		return document.getElementById(bucketId)!;
	}

	/* ------------
	 * Drag and drop setup
	 * ------------ */

	let selectedIdx = -1;
	let highlightedBin = -1;

	let binHeight: number, binWidth: number;

	function mouseDown(event: MouseEvent, itemIdx: number) {
		event.preventDefault();

		// Get the baseline offset
		selectedIdx = itemIdx;

		function cleanup() {
			// handle drop detection
			console.log('cleanup time');
			// el.classList.remove('pointer-events-none');
			document.getElementById('temp')?.remove();
			document.onmouseup = null;
			selectedIdx = -1;

			document.getElementById('temp')?.remove();
		}

		function handleDragStart(event: DragEvent) {
			let clone = (event.target as HTMLElement).cloneNode(true) as HTMLElement;
			clone.id = 'temp';
			clone.style.visibility = 'invisible'; /* or visibility: hidden, or any of the above */
			// clone.classList.add('pointer-events-none');
			document.body.appendChild(clone);
			event.dataTransfer?.setDragImage(clone, 0, 0);

			function handleDrop(event: DragEvent) {
				console.log('dropped', event);

				cleanup();
				// const dataItemIdx = event.dataTransfer!.getData('item');
				// const itemId = `shape-${dataItemIdx}`;
				// const el = document.getElementById(itemId) as HTMLElement;
				// el.classList.remove('invisible');
				// TODO: move it over if necessary

				// TODO: remove the dragging class from the item
			}
		}

		// Move relative to the last-known position
		function handleMove(event: MouseEvent) {
			// TODO: Determine if mouse is over a bin
			// TODO: set the bin being hovered over
			// TODO: clear the bin being hovered over if not hovereing
		}

		// const targetBin = getBinEl(itemIdx);
		// console.log('styling bin', targetBin);
	}

	/* ------------
	 * Cleanup
	 * ------------ */
	function handleSubmit() {
		alert('Good job, pat on the back for you.');
	}

	$: sortByColor = sortBy === 'color';

	let hoverOver: string | undefined;
</script>

<main class="w-full h-full flex m-0 p-0 overflow-hidden">
	<section
		class="flex flex-1 h-full"
		bind:clientWidth={sandboxWidth}
		bind:clientHeight={sandboxHeight}
	>
		{#each pieces as { id, color, Shape, initialTransform }, idx (id)}
			<div
				id="shape-{idx}"
				class="fixed z-10 shape"
				use:draggable={{
					defaultPosition: initialTransform
				}}
			>
				<Shape {color} size={shapeSize} />
			</div>
		{/each}
	</section>
	<section class="w-64 h-full flex flex-col">
		<div
			id={ID_BUCKET1}
			class="flex-1 border flex items-center justify-center"
			bind:clientWidth={binWidth}
			bind:clientHeight={binHeight}
			class:hovering={hoverOver === ID_BUCKET1}
		>
			{#if !sortByColor}
				<Pentagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-green-900 opacity-70" />
			{/if}
		</div>
		<div
			id="bucket2"
			class="flex-1 h-full border flex items-center justify-center"
			on:dragenter={(e) => {
				hoverOver = ID_BUCKET1;
				e.preventDefault();
			}}
		>
			{#if !sortByColor}
				<Hexagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-blue-900 opacity-70" />
			{/if}
		</div>
		<div
			id="bucket3"
			class="flex-1 border flex items-center justify-center"
			on:dragenter={(e) => {
				hoverOver = ID_BUCKET1;
				e.preventDefault();
			}}
			on:dragover={(e) => {
				e.preventDefault();
			}}
		>
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

	.shape {
		display: inline-block;

		@include grab-cursor;

		&:hovering {
			opacity: 0.3;
		}

		&:active {
			@include grabbing-cursor;
		}
	}
</style>
