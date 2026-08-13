import { Chess } from "chess.js";
import { checkOpenings } from "./checkOpenings";
import { convertEvaluation } from "./convertEvaluation";
import type { PV } from "../types/PV";
import { expectedPoints } from "./expectedPoints";
import { detectMaterialSacrifice } from "./detectMaterialSacrifice";
import { convertPGNToFENs } from "./convertPGNToFENs";

type runClassificationProps = {
	currStockfish: { evaluation: string };
	prevStockfish: { evaluation: string; bestMove: string; pv: PV[] };
	prev2Stockfish: { evaluation: string };
	pgn: string;
};
export const runClassification = async ({
	pgn,
	currStockfish,
	prevStockfish,
	prev2Stockfish,
}: runClassificationProps) => {
	// theory

	// load the previous position
	const chess = new Chess();
	chess.loadPgn(pgn);

	const colorTurn = chess.turn();
	const opponentColor = colorTurn === "b" ? "w" : "b";

	// classify as theory if the fen matches an openings database
	const opening = await checkOpenings(chess.fen());
	if (opening) {
		return { classification: "theory", opening };
	}

	// forced moves
	const lastMove = chess.undo();

	if (lastMove) {
		// if there was only 1 move use forced classification
		const moves = chess.moves().length;
		chess.move(lastMove);
		if (moves === 1) {
			return { classification: "forced" };
		}
	}

	// reload position
	chess.loadPgn(pgn);

	// get the last move
	const history = chess.history();
	const verboseHistory = chess.history({ verbose: true });
	const movePlayed = history[history.length - 1];

	// check if in checkmate
	if (chess.isCheckmate()) {
		return { classification: "best" };
	}

	if (prevStockfish.pv.length > 0) {
		// brilliant and great moves

		const isbetterMovePlayed =
			movePlayed && movePlayed === prevStockfish.bestMove;

		// check if the move is not losing
		const isDrawnOrWinning = prevStockfish.pv[0].score > -500;

		// calculate difference between top 2 moves
		const pvDiff = prevStockfish.pv[0].score - prevStockfish.pv[1].score;

		// only good move + not already winning
		const isOnlyGoodMove = pvDiff > 150;
		const isNotAlreadyWinning = prevStockfish.pv[0].score < 400;

		// brilliant moves
		const gameAfterMove = new Chess(convertPGNToFENs(pgn).at(-1) ?? "");

		const isSacrifice = detectMaterialSacrifice(
			gameAfterMove,
			verboseHistory.at(-1)?.to!,
			colorTurn,
		);
		console.log(isSacrifice);

		if (isSacrifice && movePlayed === prevStockfish.bestMove) {
			return { classification: "brilliant" };
		}

		const isGreat =
			isbetterMovePlayed &&
			isOnlyGoodMove &&
			isNotAlreadyWinning &&
			isDrawnOrWinning;

		if (isGreat) {
			return { classification: "great" };
		}
	}

	// best moves
	if (movePlayed === prevStockfish.bestMove) {
		return { classification: "best" };
	}

	// other classifications using expected points model
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
		return { classification: "a miss" };
	else return { classification: classification1 };
};
