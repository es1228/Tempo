import type { Color } from "chess.js";

export const expectedPoints = (
	evaluation2: number,
	evaluation1: number,
	colorTurn: Color,
) => {
	// change coefficient signs if it previously was blacks turn
	if (colorTurn === "w") {
		evaluation2 *= -1;
		evaluation1 *= -1;
	}

	// expected points model
	const exP = (evaluation: number) =>
		1 / (1 + Math.pow(Math.E, -0.4 * evaluation));

	// calculate points drop
	const pointsDrop = +(exP(evaluation2) - exP(evaluation1)).toFixed(2);
	console.log(pointsDrop);

	// classify moves
	if (pointsDrop <= 1.0 && pointsDrop > 0.2) return "a blunder";
	else if (pointsDrop <= 0.2 && pointsDrop > 0.1) return "a mistake";
	else if (pointsDrop <= 0.1 && pointsDrop > 0.05) return "an inaccuracy";
	else if (pointsDrop <= 0.05 && pointsDrop > 0.02) return "good";
	else if (pointsDrop <= 0.02 && pointsDrop > 0) return "excellent";
	else return "best";
};
