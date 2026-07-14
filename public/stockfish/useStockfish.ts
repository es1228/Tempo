import { useEffect, useRef, useState } from "react";
import StockFishWorker from "stockfish/bin/stockfish-18-lite.js?worker";

// props
type useStockfishProps = {
	fen: string;
};

const useStockfish = ({ fen }: useStockfishProps) => {
	// data
	const [result, setResult] = useState<string>("");

	// store the worker
	const workerRef = useRef<Worker | null>(null);

	// initiate hook
    useEffect(() => {
        // instantiate
        const worker = new StockFishWorker();
		workerRef.current = worker;
``
		// listen for message
		worker.onmessage = (event) => {
			console.log(event.data);
			setResult(event.data);
		};

		// send message to evaluate
		worker.postMessage("uci");
        worker.postMessage("isready");

        // cleanup
		return () => worker?.terminate();
    }, []) 

    // evaluate hook
    useEffect(() => {
        // create worker
        const worker = workerRef.current;
        if (!worker) return;

        // stop old analysis
        worker.postMessage("stop");
        worker.postMessage("ucinewgame")

		// send message to evaluate
		worker.postMessage(`position fen ${fen}`);
		worker.postMessage("go depth 10");
        
        // cleanup
        return () => worker.postMessage("stop");

	}, [fen]);

	// return the result
	return { result };
};
export default useStockfish;
