import { Chess } from "chess.js";
import { uciToSan } from "./uciToSan";

export const convertLineToSan = (line: string, fen: string) => {
	if (!line || !fen) return;

	const chess = new Chess();
	chess.load(fen);

	const moves = line.split(" ");
	let result = "";

	try {
		moves.forEach((move) => {
			const san = uciToSan(chess.fen(), move);
			result += san + " ";
			chess.move(move);
		});
	} catch {
		return result;
	}

	return result;
};
