import { Chess } from "chess.js";
import { checkOpenings } from "./checkOpenings";
import { convertEvaluation } from "./convertEvaluation";
import type { PV } from "../types/PV";
import { expectedPoints } from "./expectedPoints";

type runClassificationProps = {
    currStockfish: {evaluation: string}
    prevStockfish: {evaluation: string, bestMove: string, pv: PV[]}
    prev2Stockfish: {evaluation: string}
    fenAtCurr: string,
    fenAtPrev: string,
}

export const runClassification = async ({currStockfish, prevStockfish, prev2Stockfish, fenAtCurr, fenAtPrev}: runClassificationProps) => {
	// theory

	// load the previous position
	const chess = new Chess();
	chess.load(fenAtCurr);

	// classify as theory if the fen matches an openings database
	const opening = await checkOpenings(chess.fen());
	if (opening) {
		return {classification: "theory", opening}
	}
	// forced moves
	chess.load(fenAtPrev);

    if (chess.moves().length === 1)
        return {classification: "forced"}

	// reload position
	chess.load(fenAtCurr);

	// get the last move
	const history = chess.history();
	const movePlayed = history[history.length - 1];

	// check if in checkmate
	if (chess.isCheckmate()) {
		return {classification: "best"}
	}

	if (prevStockfish.pv.length > 0) {
		// great moves
		const isbetterMovePlayed =
			movePlayed && movePlayed === prevStockfish.bestMove;

		// check if the move is not losing
		const isDrawnOrWinning = prevStockfish.pv[0].score > -500;

		// calculate difference between top 2 moves
		const pvDiff = prevStockfish.pv[0].score - prevStockfish.pv[1].score;

		// only good move + not already winning
		const isOnlyGoodMove = pvDiff > 150;
		const isNotAlreadyWinning = prevStockfish.pv[0].score < 400;

		if (
			isbetterMovePlayed &&
			isOnlyGoodMove &&
			isNotAlreadyWinning &&
			isDrawnOrWinning
		) {
			return {classification: "great"}
		}
	}

	// best moves
	if (movePlayed === prevStockfish.bestMove) {
		return {classification: "best"}
	}

	// other classifications using expected points model
	const colorTurn = chess.turn();
	const opponentColor = colorTurn === "b" ? "w" : "b";

	const classification1 = expectedPoints(
		convertEvaluation(prevStockfish.evaluation),
		convertEvaluation(currStockfish.evaluation),
		colorTurn,
	);
	const classification2 = expectedPoints(
		convertEvaluation(prev2Stockfish.evaluation),
		convertEvaluation(prevStockfish.evaluation),
		opponentColor,
	);

	// calculate miss
	if (
		(classification1 === "a blunder" || classification1 === "a mistake") &&
		(classification2 === "a blunder" || classification2 === "a mistake")
	)
		return {classification: "a miss"}
	else return {classification: classification1}
};
