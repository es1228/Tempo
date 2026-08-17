import { Chess } from "chess.js";
import { checkOpenings } from "./checkOpenings";
import { convertEvaluation } from "./convertEvaluation";
import type { PV } from "../types/PV";
import { expectedPoints } from "./expectedPoints";
import {
	detectMaterialSacrifice,
	PIECE_VALUES,
} from "./detectMaterialSacrifice";

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
	const movePlayed = history[history.length - 1];

	// check if in checkmate
	if (chess.isCheckmate()) {
		return { classification: "best" };
	}

	if (prevStockfish.pv.length === 2 && prevStockfish.pv.at(0)?.score !== undefined && prevStockfish.pv.at(1)?.score !== undefined) {
		// brilliant and great moves

		const line1Score = prevStockfish.pv.at(0)?.score!;
		const line2Score = prevStockfish.pv.at(1)?.score!;

		console.log(line1Score);
		console.log(line2Score);

		const isbetterMovePlayed =
			movePlayed && movePlayed === prevStockfish.bestMove;

		// check if the move is not losing
		const isDrawnOrWinning = line1Score > -50;

		// calculate difference between top 2 moves
		const pvDiff =
			line1Score -
			line2Score;

		// only good move + not already winning
		const isOnlyGoodMove = pvDiff > 150;
		const isNotAlreadyWinning = line2Score < 400;

		// check if a move is not an obvious capture
		const lastMove = chess.history({ verbose: true }).at(-1);
		const capturedPiece = lastMove?.captured;
		const capturingPiece = lastMove?.piece;
		const defenders = chess.attackers(lastMove?.to!, colorTurn);
		const isHangingPieceCapture = capturedPiece && defenders.length === 0;

		const isObviousCapture = Boolean(
			(capturedPiece &&
				capturingPiece &&
				PIECE_VALUES[capturedPiece] >= PIECE_VALUES[capturingPiece]) ||
			isHangingPieceCapture,
		);

		// brilliant moves
		const gameAfterMove = new Chess();
		gameAfterMove.loadPgn(pgn);

		const isSacrifice = detectMaterialSacrifice(gameAfterMove);

		if (
			isSacrifice &&
			movePlayed === prevStockfish.bestMove &&
			isDrawnOrWinning
		) {
			return { classification: "brilliant" };
		}

		const isGreat =
			isbetterMovePlayed &&
			isOnlyGoodMove &&
			isNotAlreadyWinning &&
			isDrawnOrWinning &&
			!isObviousCapture;

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
