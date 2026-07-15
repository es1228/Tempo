import { Chess } from "chess.js";

// uci to san
export const uciToSan = (fen: string, uci: string) => {
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
