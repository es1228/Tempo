import { Chess } from "chess.js";

export const checkActivePlayer = (fen: string) => {
	const chess = new Chess(fen);
	const activePlayer = chess.turn();
	return activePlayer;
};
