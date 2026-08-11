import { Chess } from "chess.js";
import { convertPGNToFENs } from "./convertPGNToFENs";
import { runClassification } from "./runClassification";
import { evaluateSinglePos } from "./evaluateSinglePos";
import type { CachedEvalData } from "../hooks/useEvalCache";
import type { PV } from "../types/PV";

export const runGameReview = async (
	pgn: string,
	getCachedEval: (fen: string | undefined) => CachedEvalData | undefined,
	setCachedEval: (
		fen: string,
		evaluation: string,
		bestMove: string,
		pv: PV[],
	) => void,
	depth = 16,
	lines = 2,
) => {
	// load game
	const fens = convertPGNToFENs(pgn);
	const chess = new Chess();
	chess.loadPgn(pgn);
	const history = chess.history({ verbose: true });

	const stats = {
		white: {
			brilliant: 0,
			great: 0,
			best: 0,
			excellent: 0,
			good: 0,
			inaccuracy: 0,
			mistake: 0,
			blunder: 0,
			miss: 0,
			theory: 0,
		},
		black: {
			brilliant: 0,
			great: 0,
			best: 0,
			excellent: 0,
			good: 0,
			inaccuracy: 0,
			mistake: 0,
			blunder: 0,
			miss: 0,
			theory: 0,
		},
	};

	for (const fen of fens) {
		const cleanFen = fen.split(" ").splice(0, 4).join(" ");
		let cached = getCachedEval(cleanFen);

		if (!cached) {
			const evalResult = await evaluateSinglePos(fen, depth, lines);
			setCachedEval(
				cleanFen,
				evalResult.evaluation,
				evalResult.bestMove,
				evalResult.pv,
			);
		}
	}

	// get stats
	for (let i = 0; i < history.length; i++) {
		const move = history[i];
		const subChess = new Chess();

		for (let j = 0; j <= i; j++) subChess.move(history[j]);

		const pgn = subChess.pgn();
		const fenAtCurr = fens.at(i + 1)?.split(" ").splice(0, 4).join(" ");
		const fenAtPrev = fens.at(i)?.split(" ").splice(0, 4).join(" ");
		const fenAtPrev2 = i > 0 ? fens.at(i - 1)?.split(" ").splice(0, 4).join(" ") : undefined;

		const currStockfish = getCachedEval(fenAtCurr) ?? {
			evaluation: "+0.0",
			bestMove: "",
			pv: [],
		};
		const prevStockfish = getCachedEval(fenAtPrev) ?? {
			evaluation: "+0.0",
			bestMove: "",
			pv: [],
		};
		const prev2Stockfish = getCachedEval(fenAtPrev2) ?? {
			evaluation: "+0.0",
			bestMove: "",
			pv: [],
		};

		const result = await runClassification({
			pgn,
			currStockfish,
			prevStockfish,
			prev2Stockfish,
		});

		const classification = result.classification;
		const targetPlayer = move.color === "w" ? stats.white : stats.black;

		if (classification in targetPlayer)
			targetPlayer[classification as keyof typeof targetPlayer]++;
		else if (classification === "an inaccuracy") targetPlayer.inaccuracy++;
		else if (classification === "a mistake") targetPlayer.mistake++;
		else if (classification === "a blunder") targetPlayer.blunder++;
		else if (classification === "a miss") targetPlayer.miss++;
	}
	return stats;
};
