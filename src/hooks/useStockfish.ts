import { Chess } from "chess.js";
import { useEffect, useRef, useState } from "react";

// props
type useStockfishProps = {
	fen: string;
};

const useStockfish = ({ fen }: useStockfishProps) => {
	// data
	const [bestMove, setBestMove] = useState<string>("");

	// uci to san
	const uciToSan = (fen: string, uci: string) => {
		// create a chess board using the current position
		const chess = new Chess(fen);

		// parse the moves
		const fromSquare = uci.substring(0, 2);
		const toSquare = uci.substring(2, 4);
		const promotionPiece = uci.substring(4, 5) || null;

		// create a list of legal moves
		const legalMoves = chess.moves({ verbose: true });

		// find the matching move
		const move = legalMoves.find(
			(move) =>
				move.from === fromSquare &&
				move.to === toSquare &&
				(move.promotion || null) === promotionPiece,
		);

		// return the san
		return move?.san ?? "Illegal Move";
	};

	// store the worker
	const workerRef = useRef<Worker | null>(null);

	// initiate hook
	useEffect(() => {
		// instantiate
		const worker = new Worker("/stockfish/stockfish-18-lite.js");
		workerRef.current = worker;

		// listen for message
		worker.onmessage = (event) => {
			console.log(event.data);

			// extract best move
			if (event.data.includes("bestmove")) {
				const uci = event.data.split(" ")[1];
				setBestMove(uciToSan(fen, uci));
			}
		};

		// send message to evaluate
		worker.postMessage("uci");
		worker.postMessage("isready");

		// cleanup
		return () => worker?.terminate();
	}, []);

	// evaluate hook
	useEffect(() => {
		// create worker
		const worker = workerRef.current;
		if (!worker) return;

		// stop old analysis
		worker.postMessage("stop");
		worker.postMessage("ucinewgame");

		// send message to evaluate
		worker.postMessage(`position fen ${fen}`);
        worker.postMessage("setoption name MultiPV value 2")
		worker.postMessage("go depth 20");

		// cleanup
		return () => worker.postMessage("stop");
	}, [fen]);

	// return the result
	return { bestMove };
};
export default useStockfish;
