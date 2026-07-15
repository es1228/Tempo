import { Chess } from "chess.js";

// uci to san
export const uciToSan = (fen: string, uci: string) => {
	try {
		// create a chess board using the current position
		const chess = new Chess(fen);

		// parse the moves
		const from = uci.substring(0, 2);
		const to = uci.substring(2, 4);
		const promotion = uci.substring(4, 5) || undefined;

		// find the matching move
		const move = chess.move({ from, to, promotion });

		// return the san
		return move.san;
	} catch {
		return "Illegal Move";
	}
};
