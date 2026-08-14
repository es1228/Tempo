import type { CachedEvalData } from "../hooks/useEvalCache";
import type { PV } from "../types/PV";
import { checkActivePlayer } from "./checkActivePlayer";
import { convertPGNToFENs } from "./convertPGNToFENs";
import { uciToSan } from "./uciToSan";

const evaluateOnWorker = async (
	worker: Worker,
	fen: string,
	depth: number,
	lines: number,
): Promise<CachedEvalData> => {
	return new Promise((resolve) => {
		// instantiate
		const stockfish = worker;

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

					const mate = parts[scoreIndex + 1] === "mate";
					const score = Number(parts[scoreIndex + 2]);

					// update pv
					const moveStr = event.data.split(" pv ")[1];

					if (!isNaN(MultiPVIndex) && moveStr) {
						pv[MultiPVIndex - 1] = {
							moves: moveStr,
							score: score,
							mate: mate,
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
					resolve({ evaluation, bestMove, pv });
				}
			}
			// extract best move
			else if (event.data.startsWith("bestmove")) {
				const uci = event.data.split(" ")[1];
				bestMove = uciToSan(fen, uci)!;
				resolve({ evaluation, bestMove, pv });
			}
		};

		// send message to evaluate
		stockfish.postMessage(`setoption name MultiPV value ${lines}`);
		stockfish.postMessage(`position fen ${fen}`);
		stockfish.postMessage(`go depth ${depth}`);
	});
};

export const evaluateWithWorkerPool = async (
	pgn: string,
	depth: number,
	lines: number,
	getCachedEval: (fen: string) => CachedEvalData | undefined,
	setCachedEval: (
		fen: string,
		evaluation: string,
		bestMove: string,
		pv: PV[],
	) => void,
	poolSize = 4,
): Promise<string[]> => {
	const fens = convertPGNToFENs(pgn);

	const evaluations: string[] = new Array(fens.length);
	let currentIndex = 0;

	const workers = Array.from(
		{ length: Math.min(poolSize, fens.length) },
		() => {
			const stockfish = new Worker("/stockfish/stockfish-18-lite.js");
			stockfish.postMessage("uci");
			stockfish.postMessage("isready");
			stockfish.postMessage(`setoption name Threads value ${Math.min(navigator.hardwareConcurrency ?? 4, 6)}`);
			return stockfish;
		},
	);

	const workerTask = async (worker: Worker) => {
		while (true) {
			const index = currentIndex++;
			if (index >= fens.length) break;

			const fen = fens[index];
			const cleanFen = fen.split(" ").splice(0, 4).join(" ");
			const cached = getCachedEval(cleanFen);

			if (cached) {
				evaluations[index] = cached.evaluation;
			} else {
				const evalResult = await evaluateOnWorker(worker, fen, depth, lines);
				setCachedEval(
					cleanFen,
					evalResult.evaluation,
					evalResult.bestMove,
					evalResult.pv,
				);
				evaluations[index] = evalResult.evaluation;
			}
		}
	};

	await Promise.all(workers.map((worker) => workerTask(worker)));
	workers.forEach(worker => worker.terminate());
	return evaluations;
};
