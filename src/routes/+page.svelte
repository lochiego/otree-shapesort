<script lang="ts">
	/* ============
	 * Imports
	 * ============ */
	import Septagon from '$lib/septagon.svelte';
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

	let pieces: (Piece & { transform: Transform; targetSlot: number })[];
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
						transform: {
							x: Math.round(Math.random() * maxX),
							y: Math.round(Math.random() * maxY),
							angle: Math.round(Math.random() * 360)
						}
					};
			  });
	}

	function getBinEl(bin: number) {
		switch (bin) {
			case 0:
				return ID_BUCKET1;
			case 1:
				return ID_BUCKET2;
			default:
				return ID_BUCKET3;
		}
	}

	/* ------------
	 * Drag and drop setup
	 * ------------ */

	let offsetX: number;
	let offsetY: number;
	let selectedIdx = -1;

	function mouseDown(event: MouseEvent, itemIdx: number) {
		// event.preventDefault();

		// Get the baseline offset
		const shape = event.target as HTMLElement;
		const { top, left } = shape.getBoundingClientRect();
		offsetX = event.clientX - left;
		offsetY = event.clientY - top;
		selectedIdx = itemIdx;

		let clone = (event.target as HTMLElement).cloneNode(true) as HTMLElement;
		clone.id = 'temp';
		clone.style.visibility = 'invisible'; /* or visibility: hidden, or any of the above */
		clone.classList.add('pointer-events-none');
		document.body.appendChild(clone);
		// event.dataTransfer?.setDragImage(clone, 0, 0);

		const el = event.target as HTMLDivElement;

		// Move relative to the last-known position
		function handleMove(event: MouseEvent) {
			const tick = new Promise(requestAnimationFrame);

			const { pageX: xMove, pageY: yMove } = event;

			if (xMove === 0) {
				return;
			}

			tick.then(() => {
				console.log('mouse moved!');
				const transform = pieces[itemIdx].transform;
				transform.x = xMove - offsetX;
				transform.y = yMove - offsetY;
				pieces[itemIdx].transform = transform;
				pieces = pieces;

				clone.style.left = `${transform.x}px`;
				clone.style.top = `${transform.y}px`;
			});
		}

		document.addEventListener('mousemove', handleMove);
		// el.classList.add('pointer-events-none');

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

		const targetBin = document.getElementById(getBinEl(itemIdx)) as HTMLElement;
		const canceler = (e: Event) => e.preventDefault();
		targetBin.ondragenter = canceler;
		targetBin.ondragover = canceler;

		function cleanup() {
			// handle drop detection
			console.log('cleanup time');
			// el.classList.remove('pointer-events-none');
			console.log('classes', el.classList);
			document.removeEventListener('mousemove', handleMove);
			document.getElementById('temp')?.remove();
			document.onmouseup = null;
			targetBin.ondragenter = null;
			targetBin.ondragover = null;
			selectedIdx = -1;

			clone.remove();
		}
		document.onmouseup = cleanup;
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
		{#each pieces as { id, color, Shape }, idx (id)}
			<div
				id="shape-{idx}"
				class="fixed z-10 shape"
				style="--posx:{pieces[idx].transform.x}px;--posy:{pieces[idx].transform
					.y}px;--angle:{pieces[idx].transform.angle}deg"
				draggable="true"
				on:mousedown={(event) => mouseDown(event, idx)}
			>
				<Shape {color} size={shapeSize} />
			</div>
		{/each}
	</section>
	<section class="w-1/6 h-full flex flex-col">
		<div
			id={ID_BUCKET1}
			class="flex-1 border flex items-center justify-center"
			on:dragenter={(e) => {
				console.log('Heh heh');
				hoverOver = ID_BUCKET1;
				e.preventDefault();
			}}
			on:dragover={(e) => {
				e.preventDefault();
			}}
			class:hovering={hoverOver === ID_BUCKET1}
			on:dragexit={() => (hoverOver = undefined)}
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
			on:dragover={(e) => {
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
		$transform: translate(var(--posx), var(--posy)); // rotate(var(--angle));

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

		&:hovering {
			opacity: 0.3;
		}

		&:active {
			@include grabbing-cursor;
		}
	}
</style>
