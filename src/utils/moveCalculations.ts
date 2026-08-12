import type { Color } from "chess.js";

export const calculateWinProbability = (evaluation: string) => {
	// win probability function
	const winProbability = (evaluation: number) =>
		1 / (1 + Math.exp(-0.368208 * evaluation));

	let evalNum;

	// set checkmate to infinity
	if (evaluation.includes("M")) {
		// check who has mate
		const sign = evaluation.includes("+") ? 1 : -1;

		// format the evaluation as number
		evalNum = sign * 1000;
	} else {
		evalNum = Number(evaluation);
	}

	// calculate win probability
	return winProbability(evalNum);
};

export const calculateAccuracy = (
	winPercentBefore: number,
	winPercentAfter: number,
	colorTurn: Color,
) => {
	const sign = colorTurn === "w" ? 1 : -1;
	const accuracy =
		103.1668 * Math.exp(-4.354 * sign * (winPercentBefore - winPercentAfter)) -
		3.1669;

	return Math.max(0, Math.min(100, Number(accuracy.toFixed(1))));
};
