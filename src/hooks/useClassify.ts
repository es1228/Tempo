import { useEffect, useState } from "react";
import useStockfish from "./useStockfish";
import { convertPGNToFENs } from "../utils/convertPGNToFENs";
import { runClassification } from "../utils/runClassification";
import type { CachedEvalData } from "./useEvalCache";
import type { PV } from "../types/PV";

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

	// get fens
	const fens = convertPGNToFENs(pgn);
	const fenAtCurr = fens.at(-1);
	const fenAtPrev = fens.at(-2);
	const fenAtPrev2 = fens.at(-3);

	// get data from stockfish
	const prev2Stockfish = useStockfish({
		fen: fenAtPrev2 ?? "",
		depth: 18,
		lines: 2,
		getCachedEval,
		setCachedEval,
	});

	const prevStockfish = useStockfish({
		fen: fenAtPrev ?? "",
		depth: 18,
		lines: 2,
		getCachedEval,
		setCachedEval,
	});

	const currStockfish = useStockfish({
		fen: fenAtCurr ?? "",
		depth: 18,
		lines: 2,
		getCachedEval,
		setCachedEval,
	});

	useEffect(() => {
		setClassification("Loading");
	}, [fenAtCurr, fenAtPrev, fenAtPrev2]);

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

		const run = async () => {
			if (!isActive) return;

			const result = await runClassification({
				pgn,
				currStockfish,
				prevStockfish,
				prev2Stockfish,
			});
			setClassification(result.classification);
			if (result.opening) setOpening(result.opening);
		};
		run();

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
