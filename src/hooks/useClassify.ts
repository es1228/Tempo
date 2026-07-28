import { Chess } from "chess.js";
import { checkOpenings } from "../utils/checkOpenings";
import { expectedPoints } from "../utils/expectedPoints";
import { useEffect, useState } from "react";
import type { PV } from "../types/PV";

const useClassify = (
	pgn: string,
	bestMove: string,
	evalAtPrev2: number,
	evalAtPrev: number,
	evalAtCurrent: number,
	pv1: PV,
	pv2: PV,
	isThinking: boolean,
) => {
	// variables
	const [classification, setClassification] = useState("");
	const [opening, setOpening] = useState("");

	useEffect(() => {
		// prevent old data
		let isActive = true;
		setClassification("Loading");

		if (isThinking) return;

		const runClassification = async () => {
			// theory

			// load the previous position
			const chess = new Chess();
			chess.loadPgn(pgn);

			if (!isActive || chess.history().length === 0) return;

			// classify as theory if the pgn matches an openings database
			const opening = await checkOpenings(chess.fen());
			if (opening) {
				setClassification("theory");
				setOpening(opening);
				return;
			}

			if (!isActive) return;

			// forced moves
			const lastMove = chess.undo();

			if (lastMove) {
				// if there was only 1 move use forced classification
				const moves = chess.moves().length;
				chess.move(lastMove);
				if (moves === 1) {
					setClassification("forced");
					return;
				}
			}

			// reload position
			chess.loadPgn(pgn);

			// get the last move
			const history = chess.history();
			const movePlayed = history[history.length - 1];

			// check if in checkmate
			if (chess.isCheckmate()) {
				setClassification("best");
				return;
			}

			// great moves
			const isbetterMovePlayed = movePlayed && movePlayed === bestMove;

			// check if the move is not losing
			const isDrawnOrWinning = pv1.score > -500;

			// calculate difference between top 2 moves
			const pvDiff = pv1.score - pv2.score;

			// only good move + not already winning
			const isOnlyGoodMove = pvDiff > 150;
			const isNotAlreadyWinning = pv2.score < 400;

			if (
				isbetterMovePlayed &&
				isOnlyGoodMove &&
				isNotAlreadyWinning &&
				isDrawnOrWinning
			) {
				setClassification("great");
				return;
			}

			// best moves
			if (movePlayed === bestMove) {
				setClassification("best");
				return;
			}

			// other classifications using expected points model
			const colorTurn = chess.turn();
			const opponentColor = colorTurn === "b" ? "w" : "b";

			const classification1 = expectedPoints(
				evalAtPrev,
				evalAtCurrent,
				colorTurn,
			);
			const classification2 = expectedPoints(
				evalAtPrev2,
				evalAtPrev,
				opponentColor,
			);

			// calculate miss
			if (
				(classification1 === "a blunder" ||
					classification1 === "a mistake") &&
				(classification2 === "a blunder" ||
					classification2 === "a mistake")
			)
				setClassification("a miss");
			else setClassification(classification1);

			return;
		};
		runClassification();

		// cleanup
		return () => {
			isActive = false;
		};
	}, [
		pgn,
		bestMove,
		evalAtCurrent,
		evalAtPrev,
		evalAtPrev2,
		isThinking,
		pv1,
		pv2,
	]);
	// return data
	return { classification, opening };
};
export default useClassify;
