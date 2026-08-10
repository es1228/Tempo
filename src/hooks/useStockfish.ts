import { useEffect, useRef, useState } from "react";
import { uciToSan } from "../utils/uciToSan";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import type { PV } from "../types/PV";
import useEvalCache from "./useEvalCache";

// props
type useStockfishProps = {
	fen: string;
	depth: number;
	lines: number;
	skill?: number;
};

const useStockfish = ({ fen, depth, lines, skill }: useStockfishProps) => {
	// data
	const [bestMove, setBestMove] = useState<string>("");
	const [evaluation, setEvaluation] = useState<string>("");
	const [pv, setPV] = useState<PV[]>([]);
	const [isThinking, setIsThinking] = useState<boolean>(false);

	const { getCachedEval, setCachedEval } = useEvalCache();

	// store fen as ref
	const fenRef = useRef(fen);

	// sync fen
	useEffect(() => {
		fenRef.current = fen;
	}, [fen]);

	// store the stockfish
	const stockfishRef = useRef<Worker | null>(null);

	// initiate hook
	useEffect(() => {
		// instantiate
		const stockfish = new Worker("/stockfish/stockfish-18-lite.js");
		stockfishRef.current = stockfish;
		setPV([]);

		// listen for message
		stockfish.onmessage = (event) => {
			console.log(event.data);
			// extract best move
			if (event.data.startsWith("bestmove")) {
				const uci = event.data.split(" ")[1];
				const currentFen = fenRef.current;
				setBestMove(uciToSan(currentFen, uci)!);
				setIsThinking(false);
			}

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

					!isNaN(MultiPVIndex) &&
						setPV((prev) => {
							const updated = [...prev];
							updated[MultiPVIndex - 1] = {
								moves: moveStr,
								score: score,
							};
							return updated;
						});

					if (MultiPVIndex === 1) {
						// check active player
						const activePlayer = checkActivePlayer(fenRef.current);
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
							setEvaluation(evalStr);
							setCachedEval(fenRef.current, evalStr);
						}
					}
				}
				if (event.data.includes("mate 0")) {
					// check active player
					const activePlayer = checkActivePlayer(fenRef.current);

					// set the sign
					const sign = activePlayer === "b" ? "+" : "-";

					// set the evaluation to checkmate
					setEvaluation(`${sign}M0`);
				}
				if (event.data.includes("info depth 0 score cp 0")) {
					// draw
					setEvaluation("+0.0");
				}
			}
		};

		// send message to evaluate
		stockfish.postMessage("uci");
		stockfish.postMessage("isready");

		// cleanup
		return () => stockfish?.terminate();
	}, []);

	// evaluate hook
	useEffect(() => {
		// create stockfish
		const stockfish = stockfishRef.current;
		if (!stockfish) return;

		// cache
		const cached = getCachedEval(fen);

		if (cached) {
			setEvaluation(cached);
			setIsThinking(false);
			setPV([]);
			setBestMove("");
			return;
		}

		// set thinking
		setIsThinking(true);
		setPV([]);
		setBestMove("");

		// stop old analysis
		stockfish.postMessage("stop");
		stockfish.postMessage("ucinewgame");

		// send message to evaluate
		stockfish.postMessage(`setoption name MultiPV value ${lines}`);
		stockfish.postMessage(
			`setoption name Skill Level value ${skill ?? 20}`,
		);
		stockfish.postMessage(`position fen ${fen}`);
		stockfish.postMessage(`go depth ${depth}`);

		// cleanup
		return () => {
			stockfish.postMessage("stop");
		};
	}, [fen, depth, lines, skill, getCachedEval]);

	// return the result
	return { bestMove, evaluation, pv, isThinking };
};
export default useStockfish;
