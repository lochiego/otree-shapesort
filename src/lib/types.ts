import type { ComponentType } from 'svelte';

export type Shape = ComponentType;

export type ShapeColor = 'red' | 'green' | 'blue';

export type Point = { x: number; y: number };

export type Piece = {
	id: number;
	Shape: Shape;
	color: ShapeColor;
};
