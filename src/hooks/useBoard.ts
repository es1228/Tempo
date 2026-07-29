import {
	Chess,
	Move,
	validateFen,
	type PieceSymbol,
	type Square,
} from "chess.js";
import { useRef, useState, type CSSProperties } from "react";
import type {
	ChessboardOptions,
	PieceDropHandlerArgs,
	SquareHandlerArgs,
} from "react-chessboard";
import type { BoardColors } from "../types/BoardColors";
import { useBoardColors } from "../globalContext";

type useBoardProps = {
	boardOrientation: BoardColors;
};

const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const useBoard = ({ boardOrientation }: useBoardProps) => {
	// data
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;
	const [chessPosition, setChessPosition] = useState(chessGame.fen());
	const [chessPGN, setChessPGNState] = useState(chessGame.pgn());
	const [history, setHistory] = useState<Move[]>([]);
	const [currentMove, setCurrentMove] = useState<number>(-1);
	const [moveFrom, setMoveFrom] = useState("");
	const [optionSquares, setOptionSquares] = useState<
		Record<string, CSSProperties>
	>({});
	const [promotionMove, setPromotionMove] = useState<{
		from: Square;
		to: Square;
	} | null>(null);
	const initialFEN = useRef<string>(DEFAULT_FEN);
	const [whitePlayer, setWhitePlayer] = useState<string>("");
	const [blackPlayer, setBlackPlayer] = useState<string>("");
	const [whiteElo, setWhiteElo] = useState<string>("");
	const [blackElo, setBlackElo] = useState<string>("");

	const { boardTheme } = useBoardColors();

	// detect promotion move
	const isPromotionMove = (from: Square, to: Square) => {
		const piece = chessGame.get(from);

		if (!piece || piece.type !== "p") return false;

		const targetRank = to[1];

		if (
			(piece.color === "w" && targetRank === "8") ||
			(piece.color === "b" && targetRank === "1")
		) {
			const moves = chessGame.moves({ square: from, verbose: true });
			return moves.some((move) => move.to === to);
		}
		return false;
	};

	// sync the game state
	const syncGameState = (overrideHistory?: Move[]) => {
		// update position
		setChessPosition(chessGame.fen());
		setChessPGNState(chessGame.pgn());

		// update history
		if (overrideHistory) {
			setHistory(overrideHistory);
			setCurrentMove(overrideHistory.length - 1)
		}

		// clear movefrom and optionsquares
		setMoveFrom("");
		setOptionSquares({});
	};

	// pgn import
	const setChessPGN = (pgn: string) => {
		try {
			// reset players
			setWhitePlayer("");
			setWhiteElo("");
			setBlackPlayer("");
			setBlackElo("");

			// trim pgn
			const trimmed = pgn.trim();
			// if the pgn is actually a fen
			if (validateFen(trimmed).ok) {
				initialFEN.current = trimmed;
				chessGame.load(trimmed);
				setCurrentMove(-1);
				syncGameState();
				return;
			}

			// load the pgn
			initialFEN.current = DEFAULT_FEN;
			chessGame.loadPgn(trimmed);

			// check for player headers
			console.log(pgn);
			const headers = chessGame.getHeaders();

			setWhitePlayer(headers["White"] ?? "");
			setWhiteElo(headers["WhiteElo"] ?? "");
			setBlackPlayer(headers["Black"] ?? "");
			setBlackElo(headers["BlackElo"] ?? "");

			// sync
			chessGame.reset();
			setCurrentMove(-1);
			syncGameState();
		} catch {
			console.error("Unable to load pgn");
		}
	};

	// go to move
	const goToMove = (index: number) => {
		if (!history || history.length === 0) return;

		// hide promotion dialog
		if (!!promotionMove) setPromotionMove(null);

		// restrict index
		const clampedIndex = Math.max(-1, Math.min(index, history.length - 1));

		// reset to initial loading point and go until move is found
		chessGame.load(initialFEN.current);

		for (let i = 0; i <= clampedIndex; i++) {
			const move = history[i];
			chessGame.move(typeof move === "string" ? move : move.san);
		}

		setCurrentMove(clampedIndex);
		syncGameState();
	};

	// piece dropping logic
	const onPieceDrop = ({
		sourceSquare,
		targetSquare,
	}: PieceDropHandlerArgs) => {
		// offscreen drop
		if (!targetSquare) {
			return false;
		}

		// promotion
		const from = sourceSquare as Square;
		const to = targetSquare as Square;

		if (isPromotionMove(from, to)) {
			setPromotionMove({ from, to });
			return true;
		}

		// check if move is valid
		try {
			chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});

			syncGameState(chessGame.history({ verbose: true }));

			return true;
		} catch {
			return false;
		}
	};

	// get move options from square
	const getMoveOptions = (square: Square) => {
		// get moves
		const moves = chessGame.moves({ square, verbose: true });

		// clear square if no moves
		if (moves.length === 0) {
			setOptionSquares({});
			return false;
		}

		// new object to store option squares
		const newSquares: Record<string, CSSProperties> = {};

		// loop through moves and set the option squares
		for (const move of moves) {
			newSquares[move.to] = {
				background:
					chessGame.get(move.to) &&
					chessGame.get(move.to)?.color !==
						chessGame.get(square)?.color
						? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
						: "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
				// moving circle
				borderRadius: "50%",
			};
		}

		// set the clicked square color to yellow
		newSquares[square] = { background: "rgba(255, 255, 0, 0.4)" };

		// set option squares
		setOptionSquares(newSquares);

		// valid move options
		return true;
	};

	// square click
	const onSquareClick = ({ square, piece }: SquareHandlerArgs) => {
		// piece clicked
		if (!moveFrom && piece) {
			// get move options
			const hasMoveOptions = getMoveOptions(square as Square);

			// if move options set move from to square
			if (hasMoveOptions) setMoveFrom(square);

			return;
		}

		// check valid moves for square to move to
		const moves = chessGame.moves({
			square: moveFrom as Square,
			verbose: true,
		});
		const foundMove = moves.find(
			(m) => m.from === moveFrom && m.to === square,
		);

		// invalid move
		if (!foundMove) {
			// check for click on new piece
			const hasMoveOptions = getMoveOptions(square as Square);

			// set move from if new piece
			setMoveFrom(hasMoveOptions ? square : "");

			return;
		}

		// promotion
		const from = moveFrom as Square;
		const to = square as Square;

		if (isPromotionMove(from, to)) {
			setPromotionMove({ from, to });
			return true;
		}

		// check legal move
		try {
			chessGame.move({
				from: moveFrom,
				to: square,
				promotion: "q",
			});
		} catch {
			// invalid
			const hasMoveOptions = getMoveOptions(square as Square);

			if (hasMoveOptions) setMoveFrom(square);

			return;
		}

		syncGameState(chessGame.history({ verbose: true }));
	};

	// promotion piece select
	const onPromotionPieceSelect = (piece: PieceSymbol) => {
		try {
			chessGame.move({
				from: promotionMove!.from,
				to: promotionMove!.to,
				promotion: piece,
			});
			setChessPosition(chessGame.fen());
		} catch {}
		setPromotionMove(null);
		syncGameState(chessGame.history({ verbose: true }));
	};

	// board options
	const options: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		onSquareClick,
		squareStyles: optionSquares,
		boardStyle: {
			overflow: "visible",
			borderRadius: 10,
		},
		boardOrientation: boardOrientation,
		darkSquareStyle: { backgroundColor: boardTheme.darkSquareColor },
		lightSquareStyle: { backgroundColor: boardTheme.lightSquareColor },
		id: "board",
	};

	// last move
	const moves = chessGame.history();
	const lastMove = moves[moves.length - 1] ?? "";

	return {
		options,
		chessPosition,
		setChessPosition,
		chessGameRef,
		chessPGN,
		setChessPGN,
		history,
		goToMove,
		currentMove,
		lastMove,
		whitePlayer,
		blackPlayer,
		whiteElo,
		blackElo,
		promotionMove,
		onPromotionPieceSelect,
	};
};
export default useBoard;
