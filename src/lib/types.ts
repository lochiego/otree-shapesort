export type Shape = 'square' | 'rectangle' | 'pentagon' | 'hexagon';

export type ShapeColor = 'red' | 'green' | 'blue';

export type Piece = {
	id: number;
	shape: Shape;
	color: ShapeColor;
	position: {
		x: number;
		y: number;
	};
};
