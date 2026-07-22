import { useEffect, useRef, useState } from "react";
import { uciToSan } from "../utils/uciToSan";
import { checkActivePlayer } from "../utils/checkActivePlayer";

// props
type useStockfishProps = {
	fen: string;
	depth: number;
	lines: number;
};

const useStockfish = ({ fen, depth, lines }: useStockfishProps) => {
	// data
	const [bestMove, setBestMove] = useState<string[]>([]);
	const [evaluation, setEvaluation] = useState<string[]>([]);
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

		// listen for message
		stockfish.onmessage = (event) => {
			console.log(event.data);

			// extract best move
			if (event.data.includes("bestmove")) {
				const uci = event.data.split(" ")[1];
				const currentFen = fenRef.current;
				setBestMove(prev => [...prev, uciToSan(currentFen, uci)]);
				setIsThinking(false);
			}

			// extract evaluation
			if (event.data.includes("info") && event.data.includes("score")) {
				// parse top line
				if (
					(event.data.includes("multipv") ||
						event.data.includes("multipv 1")) &&
					event.data.includes(` depth ${depth}`)
				) {
					// extract score
					const parts = event.data.split(" ");
					const scoreIndex = parts.indexOf("score");
					const scoreType = parts[scoreIndex + 1];
					let score = parts[scoreIndex + 2];

					// check active player
					const activePlayer = checkActivePlayer(fenRef.current);

					// modify score formatting
					if (activePlayer === "b") score *= -1;

					// check the score type
					if (scoreType === "cp") {
						setEvaluation((prevEval) => [
							...prevEval,
							`${score > 0 ? "+" : ""}${(score / 100).toFixed(1)}`,
						]);
					} else if (scoreType === "mate") {
						setEvaluation((prevEval) => [
							...prevEval,
							`${score > 0 ? "+" : "-"}M${Math.abs(score)}`,
						]);
					}
				}
				if (event.data.includes("mate 0")) {
					// check active player
					const activePlayer = checkActivePlayer(fenRef.current);

					// set the sign
					const sign = activePlayer === "b" ? "+" : "-";

					// set the evaluation to checkmate
					setEvaluation((prevEval) => [...prevEval, `${sign}M0`]);
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

		// stop old analysis
		stockfish.postMessage("stop");
		stockfish.postMessage("ucinewgame");

		// send message to evaluate
		stockfish.postMessage(`position fen ${fen}`);
		stockfish.postMessage(`setoption name MultiPV value ${lines}`);
		stockfish.postMessage(`go depth ${depth}`);

		// cleanup
		return () => {
			stockfish.postMessage("stop");
			setIsThinking(false);
		};
	}, [fen]);

	// return the result
	return { bestMove, evaluation, isThinking };
};
export default useStockfish;
