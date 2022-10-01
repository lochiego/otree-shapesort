<script lang="ts">
	/* ============
	 * Imports
	 * ============ */
	import Septagon from '$lib/septagon.svelte';
	import type { DragEventData } from '@neodrag/svelte';
	import { draggable } from '@neodrag/svelte';
	import Hexagon from '../lib/hexagon.svelte';
	import Pentagon from '../lib/pentagon.svelte';
	import type { Piece, Point as Transform, Shape, ShapeColor } from '../lib/types';

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
				return COLOR_GREEN;
			case 1:
				return COLOR_BLUE;
			default:
				return COLOR_RED;
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
						inBin: false,
						initialTransform: {
							x: Math.round(Math.random() * maxX),
							y: Math.round(Math.random() * maxY),
							angle: Math.round(Math.random() * 360)
						}
					};
			  });
	}

	/* ------------
	 * Drag and drop setup
	 * ------------ */

	let selectedIdx = -1;
	let targetBin = -1;
	let hoveredBin = -1;

	let thirdBin: HTMLElement;

	function handleSelect(event: DragEventData, itemIdx: number) {
		// Get the baseline offset
		selectedIdx = itemIdx;
		targetBin = pieces[selectedIdx].targetSlot;
	}

	function cleanup() {
		console.log('cleanup time');
		// Remove any hover decorators from bins
		selectedIdx = -1;
		targetBin = -1;
		hoveredBin = -1;
	}

	function handleDrop(event: DragEventData) {
		console.log('dropped', event);

		// If we were hovering over the target then set the piece to be sorted
		if (hoveredBin >= 0) {
			pieces[selectedIdx].inBin = true;
			pieces = pieces;
		}

		cleanup();
	}

	function handleMove(event: DragEventData) {
		const midX = event.domRect.x + event.domRect.width * 0.5;
		const midY = event.domRect.y + event.domRect.height * 0.5;

		if (midX < thirdBin.offsetLeft || midY > thirdBin.offsetTop + thirdBin.clientHeight) {
			hoveredBin = -1;
		} else {
			let overBin = Math.floor(event.offsetY / thirdBin.clientHeight);
			hoveredBin = targetBin === overBin ? targetBin : -1;
		}
	}

	/* ------------
	 * Cleanup
	 * ------------ */
	function handleSubmit() {
		alert('Good job, pat on the back for you.');
	}

	$: sortByColor = sortBy === 'color';
	$: canSubmit = pieces.length && pieces.every((p) => p.inBin);
</script>

<main class="w-full h-full flex m-0 p-0 overflow-hidden">
	<section
		class="flex flex-1 h-full"
		bind:clientWidth={sandboxWidth}
		bind:clientHeight={sandboxHeight}
	>
		{#each pieces as { id, color, Shape, initialTransform, inBin }, idx (id)}
			<div
				id="shape-{idx}"
				class="fixed z-10 shape"
				class:grabbable={!inBin}
				class:sorted={inBin}
				use:draggable={{
					disabled: inBin,
					defaultPosition: initialTransform,
					onDragStart: (data) => handleSelect(data, idx),
					onDrag: handleMove,
					onDragEnd: handleDrop
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
			class:hovering={hoveredBin === 0}
		>
			{#if !sortByColor}
				<Pentagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-green-900 opacity-70" />
			{/if}
		</div>
		<div
			id={ID_BUCKET2}
			class="flex-1 h-full border flex items-center justify-center"
			class:hovering={hoveredBin === 1}
		>
			{#if !sortByColor}
				<Hexagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-blue-900 opacity-70" />
			{/if}
		</div>
		<div
			id={ID_BUCKET3}
			class="flex-1 border flex items-center justify-center"
			class:hovering={hoveredBin === 2}
			bind:this={thirdBin}
		>
			{#if !sortByColor}
				<Septagon color="#a0a0a0" size={80} />
			{:else}
				<div class="w-full h-full bg-red-900 opacity-70" />
			{/if}
		</div>
		<div id="submit" class="border flex items-stretch">
			<button
				disabled={!canSubmit}
				class="flex-1 p-9 text-2xl"
				class:bg-yellow-300={canSubmit}
				class:bg-gray-400={!canSubmit}
				on:click={handleSubmit}>Submit</button
			>
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
	}
	.grabbable {
		@include grab-cursor;

		&:hovering {
			opacity: 0.3;
		}

		&:active {
			@include grabbing-cursor;
		}
	}

	.hovering {
		opacity: 0.7;
	}

	.sorted {
		opacity: 0.8;
	}
</style>
