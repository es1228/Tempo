import { useEffect, useRef, useState } from "react";
import { uciToSan } from "../utils/uciToSan";

// props
type useStockfishProps = {
	fen: string;
	depth: number;
	lines: number;
};

const useStockfish = ({ fen, depth, lines }: useStockfishProps) => {
	// data
	const [bestMove, setBestMove] = useState<string | null>(null);
	const [isThinking, setIsThinking] = useState(false);

	// store fen as ref
	const fenRef = useRef(fen);

	// sync fen
	useEffect(() => {
		fenRef.current = fen;
	}, [fen])

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
				setBestMove(uciToSan(currentFen, uci));
				setIsThinking(false);
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
		setBestMove(null);

		// stop old analysis
		stockfish.postMessage("stop");
		stockfish.postMessage("ucinewgame");

		// send message to evaluate
		stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage(`setoption name MultiPV value ${lines}`)
		stockfish.postMessage(`go depth ${depth}`);

		// cleanup
		return () => {
			stockfish.postMessage("stop");
			setIsThinking(false);
		}
	}, [fen]);

	// return the result
	return { bestMove, isThinking };
};
export default useStockfish;
