import { Chess, type Square } from "chess.js";

export const PIECE_VALUES = {
	p: 1,
	n: 3,
	b: 3,
	r: 5,
	q: 9,
	k: 1,
};

export const detectMaterialSacrifice = (
	gameAfterMove: Chess,
) => {
	if (!gameAfterMove.history()) return false;

	const opponentColor = gameAfterMove.turn();
	const playerColor = opponentColor === "w" ? "b" : "w";

	const board = gameAfterMove.board();

	for (const row of board) {
		for (const square of row) {
			let opponentAttackValue = 0;
			let playerDefenseValue = 0;

            if (!square || square.color !== playerColor || square.type === "p") continue;

			const prevMove = gameAfterMove.history({ verbose: true }).at(-1)!;

			// ignore captures of higher value
			if (
				square.square === prevMove.to &&
				prevMove?.captured &&
				PIECE_VALUES[prevMove?.captured] > PIECE_VALUES[prevMove.piece]
			)
				continue;

			// get attackers and defenders and filter out illegal moves
			const attackingSquares = gameAfterMove.attackers(
				square.square,
				opponentColor,
			).filter(fromSquare => {
				const gameCopy = new Chess(gameAfterMove.fen());

				try {
					const result = gameCopy.move({
						from: fromSquare,
						to: square.square,
						promotion: "q",
					})
					return result !== null;
				}
				catch {
					return false;
				}
			});
			const defendingSquares = gameAfterMove.attackers(
				square.square,
				playerColor,
			);

			// check material values
			for (const sq of attackingSquares) {
				const piece = gameAfterMove.get(sq as Square);
				if (piece) opponentAttackValue += PIECE_VALUES[piece.type] || 0;
			}

			for (const sq of defendingSquares) {
				const piece = gameAfterMove.get(sq as Square);
				if (piece) playerDefenseValue += PIECE_VALUES[piece.type] || 0;
			}

			if (opponentAttackValue === 0) continue;
			if (playerDefenseValue > 0) continue;

			console.log(
				`Square: ${square.square}, Attackers: ${opponentAttackValue}, Defenders: ${playerDefenseValue}`,
			);
			if (opponentAttackValue > playerDefenseValue) return true;
		}
	}
	return false;
};
