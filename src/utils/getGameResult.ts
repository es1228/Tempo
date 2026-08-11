import type { Chess } from "chess.js";
import { checkActivePlayer } from "./checkActivePlayer";
import { hasInsufficientMaterial } from "./hasInsufficientMaterial";

const getGameResult = (
	chessGame: Chess,
	whiteName: string,
	blackName: string,
	whiteTime: number,
	blackTime: number,
) => {
	const prevPlayer =
		checkActivePlayer(chessGame.fen()) === "w" ? blackName : whiteName;

	if (chessGame.isCheckmate()) return `${prevPlayer} won by checkmate`;
	if (chessGame.isStalemate()) return "Draw by stalemate";
	if (chessGame.isInsufficientMaterial())
		return "Draw by insufficient material";
	if (chessGame.isThreefoldRepetition())
		return "Draw by threefold repetition";
	if (chessGame.isDrawByFiftyMoves()) return "Draw by 50 move rule";
	if (
		(whiteTime === 0 && hasInsufficientMaterial(chessGame, "b")) ||
		(blackTime === 0 && hasInsufficientMaterial(chessGame, "w"))
	)
		return "Draw by insufficient vs timeout";
	if (whiteTime === 0) return `${blackName} won by timeout`;
	if (blackTime === 0) return `${whiteName} won by timeout`;

	return null;
};
export default getGameResult;
