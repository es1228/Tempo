import { Chess } from "chess.js";

export const convertPGNToFENs = (pgn: string) => {
	try {
		const trimmed = pgn.trim();
		const fenMatch = trimmed.match(/\[FEN\s+"([^"]+)"\]/)
		const startFen = fenMatch ? fenMatch[1] : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

		const chess = new Chess();
		chess.loadPgn(pgn);

		const history = chess.history();

		chess.load(startFen);
		const fens: string[] = [chess.fen()];

		for (const move of history) {
			chess.move(move);
			fens.push(chess.fen());
		}

		return fens;
	} catch {
		return [];
	}
};
