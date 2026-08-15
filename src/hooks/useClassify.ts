import { useEffect, useState } from "react";
import { convertPGNToFENs } from "../utils/convertPGNToFENs";
import { runClassification } from "../utils/runClassification";
import type { CachedEvalData } from "./useEvalCache";
import type { PV } from "../types/PV";
import { evaluateOnWorker } from "../utils/evaluateGame";

const useClassify = (
	pgn: string,
	getCachedEval: (fen: string | undefined) => CachedEvalData | undefined,
	setCachedEval: (
		fen: string,
		evaluation: string,
		bestMove: string,
		pv: PV[],
	) => void,
) => {
	// variables
	const [classification, setClassification] = useState("");
	const [opening, setOpening] = useState("");
	const [evaluation, setEvaluation] = useState<string>("+0.0");
	const [prevBestMove, setPrevBestMove] = useState<string>("");
	const [pv, setPv] = useState<PV[]>([]);

	// get fens
	const fens = convertPGNToFENs(pgn);
	const fenAtCurr = fens.at(-1);
	const fenAtPrev = fens.at(-2);
	const fenAtPrev2 = fens.at(-3);

	useEffect(() => {
		setClassification("Loading");
	}, [fenAtCurr, fenAtPrev, fenAtPrev2, pgn]);

	useEffect(() => {
		// prevent old data
		let isActive = true;
		setClassification("Loading");

		// get data from stockfish
		const run = async () => {
			try {
				const fetchEval = async (
					fen: string | undefined,
				): Promise<CachedEvalData> => {
					if (!fen) {
						return { evaluation: "+0.0", bestMove: "", pv: [] };
					}

					const cached = getCachedEval(fen);
					if (cached) return cached;

					const worker = new Worker(
						"/stockfish/stockfish-18-lite.js",
					);
					const result = await evaluateOnWorker(worker, fen, 16, 2);
					worker.terminate();

					setCachedEval(
						fen,
						result.evaluation,
						result.bestMove,
						result.pv,
					);
					return result;
				};
				const [prev2Stockfish, prevStockfish, currStockfish] =
					await Promise.all([
						fetchEval(fenAtPrev2),
						fetchEval(fenAtPrev),
						fetchEval(fenAtCurr),
					]);

				setEvaluation(currStockfish.evaluation);
				setPrevBestMove(prevStockfish.bestMove);
				setPv(currStockfish.pv);
				setCachedEval(
					fenAtCurr ?? "",
					currStockfish.evaluation,
					currStockfish.bestMove,
					currStockfish.pv,
				);
				setCachedEval(
					fenAtPrev ?? "",
					prevStockfish.evaluation,
					prevStockfish.bestMove,
					prevStockfish.pv,
				);
				setCachedEval(
					fenAtPrev2 ?? "",
					prev2Stockfish.evaluation,
					prev2Stockfish.bestMove,
					prev2Stockfish.pv,
				);

				const result = await runClassification({
					pgn,
					currStockfish,
					prevStockfish,
					prev2Stockfish,
				});

				if (!isActive) return;

				setClassification(result.classification);
				if (result.opening) setOpening(result.opening);
			} catch {}
		};
		run();

		// cleanup
		return () => {
			isActive = false;
		};
	}, [pgn]);
	// return data
	return {
		classification,
		opening,
		prevBestMove,
		evaluation,
		pv,
	};
};
export default useClassify;
