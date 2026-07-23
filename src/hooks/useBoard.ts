import { Chess, Move, validateFen, type Square } from "chess.js";
import { useRef, useState, type CSSProperties } from "react";
import type {
	ChessboardOptions,
	PieceDropHandlerArgs,
	SquareHandlerArgs,
} from "react-chessboard";
import type { BoardColors } from "../types/BoardColors";

type useBoardProps = {
	boardOrientation: BoardColors;
};

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

	// sync the game state
	const syncGameState = (overrideHistory?: Move[]) => {
		// update position
		setChessPosition(chessGame.fen());
		setChessPGNState(chessGame.pgn());

		// get history
		const history = overrideHistory ?? chessGame.history({ verbose: true });
		setHistory(history);

		// clear movefrom and optionsquares
		setMoveFrom("");
		setOptionSquares({});

		// update current move
		if (!overrideHistory)
			setCurrentMove(history.length - 1);
	};

	// pgn import
	const setChessPGN = (pgn: string) => {
		try {
			const trimmed = pgn.trim();
			// if the pgn is actually a fen
			if (validateFen(trimmed).ok) {
				chessGame.load(trimmed);
				setCurrentMove(-1);
				syncGameState();
				return;
			}

			chessGame.loadPgn(trimmed);
			const fullHistory = chessGame.history({ verbose: true });

			chessGame.reset();
			setCurrentMove(-1);
			syncGameState(fullHistory);
		} catch {
			console.error("Unable to load pgn");
		}
	};

	// go to move
	const goToMove = (index: number) => {
		if (!history || history.length === 0) return;

		// restrict index
		const clampedIndex = Math.max(-1, Math.min(index, history.length - 1));

		// reset to start and go until move is found
		chessGame.reset();
		for (let i = 0; i <= clampedIndex; i++) chessGame.move(history[i]);

		setCurrentMove(clampedIndex);
		syncGameState(history);
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

		// check if move is valid
		try {
			chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});

			syncGameState();

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

		syncGameState();
	};

	// board options
	const options: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		onSquareClick,
		squareStyles: optionSquares,
		boardStyle: {
			borderRadius: 10,
		},
		boardOrientation: boardOrientation,
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
	};
};
export default useBoard;
