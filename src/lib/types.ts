import type { ComponentType } from 'svelte';

export type Shape = ComponentType;

export type ShapeColor = string;

export type Point = { x: number; y: number; angle: number };

export type Piece = {
	id: number;
	Shape: Shape;
	color: ShapeColor;
	inBin: boolean;
};
