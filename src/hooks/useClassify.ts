import { Chess } from "chess.js";
import { checkOpenings } from "../utils/checkOpenings";
import { expectedPoints } from "../utils/expectedPoints";
import { useEffect, useState } from "react";
import useStockfish from "./useStockfish";
import { convertEvaluation } from "../utils/convertEvaluation";
import { convertPGNToFENs } from "../utils/convertPgnToFens";

const useClassify = (pgn: string) => {
	// variables
	const [classification, setClassification] = useState("");
	const [opening, setOpening] = useState("");

	// get fens
	const fens = convertPGNToFENs(pgn);
	const fenAtCurr = fens.at(-1);
	const fenAtPrev = fens.at(-2);
	const fenAtPrev2 = fens.at(-3);

	// get data from stockfish
	const prev2Stockfish = useStockfish({
		fen: fenAtPrev2 ?? "",
		depth: 20,
		lines: 2,
	});

	const prevStockfish = useStockfish({
		fen: fenAtPrev ?? "",
		depth: 20,
		lines: 2,
	});

	const currStockfish = useStockfish({
		fen: fenAtCurr ?? "",
		depth: 20,
		lines: 2,
	});

	useEffect(() => {
		// prevent old data
		let isActive = true;
		setClassification("Loading");

		if (
			prev2Stockfish.isThinking ||
			prevStockfish.isThinking ||
			currStockfish.isThinking ||
			!prevStockfish.bestMove ||
			!currStockfish.evaluation
		)
			return;

		const runClassification = async () => {
			// theory

			// load the previous position
			const chess = new Chess();
			chess.loadPgn(pgn);

			if (!isActive || chess.history().length === 0) return;

			// classify as theory if the fen matches an openings database
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

			if (prevStockfish.pv.length > 0) {
				// great moves
				const isbetterMovePlayed =
					movePlayed && movePlayed === prevStockfish.bestMove;

				// check if the move is not losing
				const isDrawnOrWinning = prevStockfish.pv[0].score > -500;

				// calculate difference between top 2 moves
				const pvDiff =
					prevStockfish.pv[0].score - prevStockfish.pv[1].score;

				// only good move + not already winning
				const isOnlyGoodMove = pvDiff > 150;
				const isNotAlreadyWinning = prevStockfish.pv[0].score < 400;

				if (
					isbetterMovePlayed &&
					isOnlyGoodMove &&
					isNotAlreadyWinning &&
					isDrawnOrWinning
				) {
					setClassification("great");
					return;
				}
			}

			// best moves
			if (movePlayed === prevStockfish.bestMove) {
				setClassification("best");
				return;
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
		fenAtCurr,
		fenAtPrev,
		fenAtPrev2,
		currStockfish,
		prevStockfish,
		prev2Stockfish,
	]);
	// return data
	return {
		classification,
		opening,
		prevBestMove: prevStockfish.bestMove,
		evaluation: currStockfish.evaluation,
	};
};
export default useClassify;
