import type { Chess, Color, PieceSymbol } from "chess.js";

export const hasInsufficientMaterial = (chessGame: Chess, activePlayer: Color) => {
	const pieces: PieceSymbol[] = [];

	chessGame.board().forEach((row) => {
		row.forEach((square) => {
			if (square && square.color === activePlayer)
				pieces.push(square.type);
		});
	});

	const pawns = pieces.filter((p) => p === "p").length;
	const bishops = pieces.filter((p) => p === "b").length;
	const knights = pieces.filter((p) => p === "n").length;
	const rooks = pieces.filter((p) => p === "r").length;
	const queens = pieces.filter((p) => p === "q").length;

	if (pawns > 0 || queens > 0 || rooks > 0) return false;
	if (knights === 0 && bishops === 0) return true;
	if (knights === 1 && bishops === 0) return true;
	if (bishops === 1 && knights === 0) return true;
	if (knights === 2 && bishops === 0) return true;
	return false;
};
