import { Chess, validateFen } from "chess.js"
import { checkActivePlayer } from "./checkActivePlayer";

export const checkLegalFen = (fen: string): boolean => {
    if (!validateFen(fen).ok) return false;

    try {
        const parts = fen.trim().split(" ");
        const activeTurn = checkActivePlayer(fen);
        const oppositeTurn = activeTurn === "w" ? "b" : "w";

        parts[1] = oppositeTurn;
        const testFen = parts.join(" ");

        const testGame = new Chess(testFen);
        if (testGame.isCheck())
            return false;

        return true;
    }
    catch {
        return false;
    }
}