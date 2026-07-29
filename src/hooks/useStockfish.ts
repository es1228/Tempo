import { useEffect, useRef, useState } from "react";
import { uciToSan } from "../utils/uciToSan";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import type { PV } from "../types/PV";

// props
type useStockfishProps = {
	fen: string;
	depth: number;
	lines: number;
};

const useStockfish = ({ fen, depth, lines }: useStockfishProps) => {
	// data
	const [bestMove, setBestMove] = useState<string>("");
	const [evaluation, setEvaluation] = useState<string>("");
	const [pv, setPV] = useState<PV[]>([]);
	const [isThinking, setIsThinking] = useState<boolean>(false);

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
						const formattedScore = activePlayer === "b" ? -1 * score : score

						// check the score type
						if (scoreType === "cp") {
							setEvaluation(
								`${formattedScore > 0 ? "+" : ""}${(formattedScore / 100).toFixed(1)}`,
							);
						} else if (scoreType === "mate") {
							setEvaluation(
								`${formattedScore > 0 ? "+" : "-"}M${Math.abs(formattedScore)}`,
							);
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

		// set thinking
		setIsThinking(true);
		setPV([]);
		setBestMove("");

		// stop old analysis
		stockfish.postMessage("stop");

		// send message to evaluate
		stockfish.postMessage(`position fen ${fen}`);
		stockfish.postMessage(`setoption name MultiPV value ${lines}`);
		stockfish.postMessage(`go depth ${depth}`);

		// cleanup
		return () => {
			stockfish.postMessage("stop");
		};
	}, [fen, depth, lines]);

	// return the result
	return { bestMove, evaluation, pv, isThinking };
};
export default useStockfish;
