import { Chess } from "chess.js";

export const undoMove = (chess: Chess, full: boolean) => {
	if (full) {
		while (chess.undo() !== null) {
			chess.undo();
		}
	} else {
		chess.undo();
	}

	return chess.fen();
};
