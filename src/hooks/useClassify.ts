import { Chess } from "chess.js";
import { checkOpenings } from "../utils/checkOpenings";
import { expectedPoints } from "../utils/expectedPoints";
import { useEffect, useState } from "react";

const useClassify = (
	pgn: string,
	bestMove: string,
	evaluation3: number,
	evaluation2: number,
	evaluation1: number,
	isThinking: boolean,
) => {
	// variables
	const [classification, setClassification] = useState("");
	const [opening, setOpening] = useState("");

	useEffect(() => {
		// prevent old data
		let isActive = true;
		setClassification("Loading...");

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

			// best moves

			// get the last move
			const history = chess.history();
			const movePlayed = history[history.length - 1];

			// compare with best move or end early if it is checkmate
			if (movePlayed === bestMove || chess.isCheckmate()) {
				setClassification("best");
				return;
			}

			// other classifications using expected points model
			const colorTurn = chess.turn();
			const classification1 = expectedPoints(evaluation2, evaluation1, colorTurn);
			const classification2 = expectedPoints(evaluation3, evaluation2, colorTurn === "b" ? "w" : "b");

			// calculate miss
			if (classification1 === "a blunder" && classification2 === "a blunder")
				setClassification("a miss");
			else setClassification(classification1);

			return;
		};
		runClassification();

		// cleanup
		return () => {
			isActive = false;
		};
	}, [pgn, bestMove, evaluation1, evaluation2, isThinking]);
	// return data
	return { classification, opening };
};
export default useClassify;
