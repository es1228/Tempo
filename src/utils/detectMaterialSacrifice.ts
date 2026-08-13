import type { Chess, Color, Square } from "chess.js";

const PIECE_VALUES = {
	p: 1,
	n: 3,
	b: 3,
	r: 5,
	q: 9,
	k: 1,
};

export const detectMaterialSacrifice = (
	gameAfterMove: Chess,
	targetSquare: Square,
	playerColor: Color,
) => {
	let opponentAttackValue = 0;
	let playerDefenseValue = 0;
	const opponentColor = playerColor === "w" ? "b" : "w";

    const attackingSquares = gameAfterMove.attackers(targetSquare, playerColor);
    const defendingSquares = gameAfterMove.attackers(targetSquare, opponentColor);

	for (const sq of attackingSquares) {
        const piece = gameAfterMove.get(sq as Square);
        if (piece) opponentAttackValue += PIECE_VALUES[piece.type] || 0;
    }

    for (const sq of defendingSquares) {
        const piece = gameAfterMove.get(sq as Square);
        if (piece) playerDefenseValue += PIECE_VALUES[piece.type] || 0;
    }

    if (opponentAttackValue === 0) return false;
    if (playerDefenseValue > 0) return false;

    console.log(`Square: ${targetSquare}, Attackers: ${opponentAttackValue}, Defenders: ${playerDefenseValue}`);
    return opponentAttackValue > playerDefenseValue;
};
