<script lang="ts">
	/* ============
	 * Imports
	 * ============ */
	import Septagon from '../lib/septagon.svelte';
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
	let halfSize = shapeSize * 0.5;

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

	function createPieces(): (Piece & { initialTransform: Transform; targetSlot: number })[] {
		const maxX = sandboxWidth - shapeSize;
		const maxY = sandboxHeight - shapeSize;

		return Array.from(Array(numShapes)).map((_, idx) => {
			const bin = randomBin();
			const [color, shape] =
				sortBy === 'color' ? [colorForBin(bin), randomShape()] : [randomColor(), shapeForBin(bin)];

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

	let pieces: (Piece & { initialTransform: Transform; targetSlot: number })[];
	$: {
		pieces = !loaded ? [] : createPieces();
	}

	/* ------------
	 * Drag and drop setup
	 * ------------ */

	let selectedIdx = -1;
	let targetBin = -1;
	let hoveredBin = -1;

	let thirdBin: HTMLElement;

	/**
	 * Prepares the game board to drop the selected target
	 * @param event The drag event
	 * @param itemIdx The index of the piece in the array to resolve the target bin
	 */
	function handleSelect(event: DragEventData, itemIdx: number) {
		// Get the baseline offset
		selectedIdx = itemIdx;
		targetBin = pieces[selectedIdx].targetSlot;
	}

	/**
	 * Determines whether at least half of the game piece is over the target bin
	 * @param event The drag event which includes position information
	 */
	function handleMove(event: DragEventData) {
		const midX = event.domRect.x + halfSize;
		const midY = event.domRect.y + halfSize;

		if (midX < thirdBin.offsetLeft) {
			hoveredBin = -1;
		} else {
			let overBin = Math.floor(midY / thirdBin.clientHeight);
			hoveredBin = targetBin === overBin ? targetBin : -1;
		}
	}

	/**
	 * Resets metadata regarding the selected and target bins
	 */
	function cleanup() {
		// Remove any hover decorators from bins
		selectedIdx = -1;
		targetBin = -1;
		hoveredBin = -1;
	}

	/**
	 * 'Drops' the element into target bin, removing its interaction
	 * @param event
	 */
	function handleDrop(event: DragEventData) {
		// If we were hovering over the target then set the piece to be sorted
		if (hoveredBin >= 0) {
			pieces[selectedIdx].inBin = true;
			// TODO: Update game statistics
			pieces = pieces;
			try{
					// @ts-ignore otree-injected global function
				liveSend("sorted")
			}
			catch (e) {
				console.error('Unexpected error when sending "sorted"', e);
			}
		}
		cleanup();

		// Check if the game is over
		if (pieces.length && pieces.every((p) => p.inBin)) {
			handleFinished();
		}
	}

	/**
	 * Resets the gameboard
	 */
	function handleFinished() {
		// TODO: Animate Out

		// TODO: Animate in new set

		pieces = [];
		requestAnimationFrame((tick) => {
			setTimeout(() => {
				pieces = createPieces();
			}, 1000);
		});

		// TODO: Update game statistics
		try {
		// @ts-ignore otree-injected global
		liveSend("completed");
		} catch (e) {
			console.error('Unexpected error when sending "sorted"', e);
		}
	}

	$: sortByColor = sortBy === 'color';
</script>

<main class="w-screen h-screen flex m-0 p-0 overflow-hidden">
	<section
		class="flex flex-1 h-full"
		bind:clientWidth={sandboxWidth}
		bind:clientHeight={sandboxHeight}
	>
		<h2 class="flex-1 text-4xl font-bold text-center pt-8">Sort the shapes</h2>
		{#each pieces as { id, color, Shape, initialTransform, inBin }, idx (id)}
			<div
				id="shape-{idx}"
				class="fixed shape z-{inBin ? '0' : '10'}"
				class:grabbable={!inBin}
				class:sorted={inBin}
				class:grayscale-50={inBin}
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
			opacity: 0.8;
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
