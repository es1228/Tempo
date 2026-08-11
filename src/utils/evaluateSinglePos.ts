import type { CachedEvalData } from "../hooks/useEvalCache";
import type { PV } from "../types/PV";
import { checkActivePlayer } from "./checkActivePlayer";
import { uciToSan } from "./uciToSan";

export const evaluateSinglePos = async (
	fen: string,
	depth: number,
	lines: number,
): Promise<CachedEvalData> => {
	return new Promise((resolve) => {
		// instantiate
		const stockfish = new Worker("/stockfish/stockfish-18-lite.js");

		// data
		let bestMove = "";
		let evaluation = "";
		let pv: PV[] = [];

		// listen for message
		stockfish.onmessage = (event) => {
			console.log(event.data);

			// extract evaluation
			if (event.data.includes("info") && event.data.includes("score")) {
				if (
					event.data.includes("multipv") &&
					event.data.includes(`info depth ${depth}`)
				) {
					// extract score
					const parts = event.data.split(" ");
					const scoreIndex = parts.indexOf("score");
					const scoreType = parts[scoreIndex + 1];

					// multipv
					const MultiPVIndex = Number(
						parts[parts.indexOf("multipv") + 1],
					);

					const score = Number(parts[scoreIndex + 2]);

					// update pv
					const moveStr = event.data.split(" pv ")[1];

					if (!isNaN(MultiPVIndex) && moveStr) {
						pv[MultiPVIndex - 1] = {
							moves: moveStr,
							score: score,
						};
					}

					if (MultiPVIndex === 1) {
						// check active player
						const activePlayer = checkActivePlayer(fen);
						const formattedScore =
							activePlayer === "b" ? -1 * score : score;

						// check the score type
						let evalStr = "";
						if (scoreType === "cp") {
							evalStr = `${formattedScore > 0 ? "+" : ""}${(formattedScore / 100).toFixed(1)}`;
						} else if (scoreType === "mate") {
							evalStr = `${formattedScore > 0 ? "+" : "-"}M${Math.abs(formattedScore)}`;
						}

						if (evalStr) {
							evaluation = evalStr;
						}
					}
				}
				if (event.data.includes("mate 0")) {
					// check active player
					const activePlayer = checkActivePlayer(fen);

					// set the sign
					const sign = activePlayer === "b" ? "+" : "-";

					// set the evaluation to checkmate
					evaluation = `${sign}M0`;
					resolve({ evaluation, bestMove, pv });
				}
				if (event.data.includes("info depth 0 score cp 0")) {
					// draw
					evaluation = "+0.0";

					// cleanup
					stockfish?.terminate();
					resolve({ evaluation, bestMove, pv });
				}
			}
			// extract best move
			else if (event.data.startsWith("bestmove")) {
				const uci = event.data.split(" ")[1];
				bestMove = uciToSan(fen, uci)!;

				// cleanup
				stockfish?.terminate();
				resolve({ evaluation, bestMove, pv });
			}
		};

		// send message to evaluate
		stockfish.postMessage("uci");
		stockfish.postMessage("isready");
		stockfish.postMessage(`setoption name MultiPV value ${lines}`);
		stockfish.postMessage(`position fen ${fen}`);
		stockfish.postMessage(`go depth ${depth}`);

		// cleanup
		return () => stockfish?.terminate();
	});
};
