import { useCallback, useRef } from "react";
import type { PV } from "../types/PV";

export type CachedEvalData = {
	evaluation: string;
	bestMove: string;
	pv: PV[];
};

const useEvalCache = () => {
	const cacheRef = useRef<Map<string, CachedEvalData>>(new Map());

	const getCachedEval = useCallback((fen: string | undefined) => {
		if (!fen) return;

		const cleanFen = fen.split(" ").splice(0, 4).join(" ");
		return cacheRef.current.get(cleanFen);
	}, []);

	const setCachedEval = useCallback(
		(fen: string, evaluation: string, bestMove: string, pv: PV[]) => {
			const cleanFen = fen.split(" ").splice(0, 4).join(" ");
			cacheRef.current.set(cleanFen, { evaluation, bestMove, pv });
		},
		[],
	);

	return { getCachedEval, setCachedEval };
};
export default useEvalCache;
