import { Chess } from "chess.js";

// uci to san
export const uciToSan = (fen: string, uci: string) => {
	if (!uci || !fen || uci === "(none)" || uci === "null")
		return;
	
	try {
		// create a chess board using the current position
		const chess = new Chess(fen);

		// parse the moves
		const cleanUCI = uci.trim().split(" ")[0];
		const from = cleanUCI.substring(0, 2);
		const to = cleanUCI.substring(2, 4);
		const promotion = cleanUCI.substring(4, 5) || undefined;

		// find the matching move
		const move = chess.move({ from, to, promotion });

		// return the san
		return move.san;
	} catch {
		return "None";
	}
};
