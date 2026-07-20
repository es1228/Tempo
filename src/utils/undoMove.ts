import { Chess } from "chess.js";

export const undoMove = (chess: Chess) => {
    chess.undo();

    return chess.fen();
}