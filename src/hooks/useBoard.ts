import {
	Chess,
	validateFen,
	type Color,
	type PieceSymbol,
	type Square,
} from "chess.js";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type {
	ChessboardOptions,
	PieceDropHandlerArgs,
	SquareHandlerArgs,
} from "react-chessboard";
import type { BoardColors } from "../types/BoardColors";
import { useBoardColors } from "../globalContext";
import useStockfish from "./useStockfish";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import useEvalCache from "./useEvalCache";
import type { MoveNode } from "../types/HistoryTree";

type useBoardProps = {
	boardOrientation: BoardColors;
	whiteTime?: number;
	blackTime?: number;
	isPlayingAgainstEngine?: boolean;
	playerColor?: Color;
	engineStrength?: number;
};

export const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const useBoard = ({
	boardOrientation,
	whiteTime,
	blackTime,
	isPlayingAgainstEngine,
	playerColor,
	engineStrength,
}: useBoardProps) => {
	// data
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;
	const [chessPosition, setChessPosition] = useState(chessGame.fen());
	const [chessPGN, setChessPGNState] = useState(chessGame.pgn());
	// history tree
	const rootNodeRef = useRef<MoveNode>({
		id: "root",
		fen: DEFAULT_FEN,
		move: null,
		parent: null,
		children: [],
	});
	const [currentNode, setCurrentNode] = useState<MoveNode>(
		rootNodeRef.current,
	);
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

	const { getCachedEval, setCachedEval } = useEvalCache();

	const { bestMove } = useStockfish({
		fen: chessGame.fen(),
		depth: 16,
		lines: 1,
		skill: engineStrength,
		getCachedEval,
		setCachedEval,
		isInUse: isPlayingAgainstEngine,
	});

	// rebuild tree
	const loadNodeState = (targetNode: MoveNode) => {
		chessGame.load(initialFEN.current);

		// collect path
		const path: MoveNode[] = [];
		let curr: MoveNode | null = targetNode;
		while (curr && curr.parent !== null) {
			path.unshift(curr);
			curr = curr.parent;
		}

		// replay moves
		for (const node of path) {
			if (node.move) {
				chessGame.move({
					from: node.move.from,
					to: node.move.to,
					promotion: node.move.promotion,
				});
			}
		}

		setChessPosition(chessGame.fen());
		setChessPGNState(chessGame.pgn());
		setMoveFrom("");
		setOptionSquares({});
	};

	// commit move + manage variation tree branches
	const commitMoveAndBranch = (
		from: Square,
		to: Square,
		promotion: PieceSymbol = "q",
	) => {
		try {
			// get move details
			chessGame.move({ from, to, promotion });
			const verboseMoves = chessGame.history({ verbose: true });
			const latestMove = verboseMoves.at(-1);
			const newFen = chessGame.fen();

			// check if exists already
			const existingChild = currentNode.children.find(
				(child) =>
					child.move &&
					child.move.from === latestMove?.from &&
					child.move.to === latestMove.to &&
					child.move.promotion === latestMove.promotion,
			);

			if (existingChild) {
				setCurrentNode(existingChild);
				loadNodeState(existingChild);
			} else {
				const newNode: MoveNode = {
					id: crypto.randomUUID(),
					fen: newFen,
					move: latestMove ?? null,
					parent: currentNode,
					children: [],
				};

				currentNode.children.push(newNode);
				setCurrentNode(newNode);
				setChessPosition(newFen);
				setChessPGNState(chessGame.pgn());
			}

			setMoveFrom("");
			setOptionSquares({});
			return true;
		} catch {
			loadNodeState(currentNode);
			return false;
		}
	};

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
				rootNodeRef.current = {
					id: "root",
					fen: trimmed,
					move: null,
					parent: null,
					children: [],
				};
				setCurrentNode(rootNodeRef.current);
				setChessPosition(trimmed);
				setChessPGNState(chessGame.pgn());
				return;
			}

			// load the pgn
			initialFEN.current = DEFAULT_FEN;
			chessGame.loadPgn(trimmed);

			// check for player headers
			//console.log(pgn);
			const headers = chessGame.getHeaders();

			setWhitePlayer(headers["White"] ?? "");
			setWhiteElo(headers["WhiteElo"] ?? "");
			setBlackPlayer(headers["Black"] ?? "");
			setBlackElo(headers["BlackElo"] ?? "");

			// sync
			const verboseHistory = chessGame.history({ verbose: true });

			// rebuild tree
			const newRoot: MoveNode = {
				id: "root",
				fen: DEFAULT_FEN,
				move: null,
				parent: null,
				children: [],
			};

			let pointer = newRoot;
			chessGame.reset();

			for (const move of verboseHistory) {
				chessGame.move({
					from: move.from,
					to: move.to,
					promotion: move.promotion,
				});
				const newNode: MoveNode = {
					id: crypto.randomUUID(),
					fen: chessGame.fen(),
					move,
					parent: pointer,
					children: [],
				};
				pointer.children.push(newNode);
				pointer = newNode;
			}
			rootNodeRef.current = newRoot;
			setCurrentNode(pointer);
			loadNodeState(pointer);
		} catch {
			console.error("Unable to load pgn");
		}
	};

	// go to move
	const goToNode = (node: MoveNode) => {
		if (!!promotionMove) setPromotionMove(null);
		setCurrentNode(node);
		loadNodeState(node);
	};

	// piece dropping logic
	const onPieceDrop = ({
		sourceSquare,
		targetSquare,
	}: PieceDropHandlerArgs) => {
		if (
			!targetSquare ||
			whiteTime === 0 ||
			blackTime === 0 ||
			(isPlayingAgainstEngine && chessGame.turn() !== playerColor) ||
			chessGame.isGameOver()
		) {
			return false;
		}

		loadNodeState(currentNode);

		// promotion
		const from = sourceSquare as Square;
		const to = targetSquare as Square;

		if (isPromotionMove(from, to)) {
			setPromotionMove({ from, to });
			return true;
		}

		return commitMoveAndBranch(from, to, "q");
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
		if (
			whiteTime === 0 ||
			blackTime === 0 ||
			(isPlayingAgainstEngine && chessGame.turn() !== playerColor) ||
			chessGame.isGameOver()
		)
			return;

		loadNodeState(currentNode);

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

		commitMoveAndBranch(from, to, "q");
	};

	// promotion piece select
	const onPromotionPieceSelect = (piece: PieceSymbol) => {
		if (promotionMove) {
			loadNodeState(currentNode);
			commitMoveAndBranch(promotionMove.from, promotionMove.to, piece);
		}
		setPromotionMove(null);
	};

	// engine moves
	useEffect(() => {
		const engineMove = () => {
			if (!isPlayingAgainstEngine) return;

			const isEngineTurn =
				checkActivePlayer(chessGame.fen()) !== playerColor;

			if (isEngineTurn && bestMove && !chessGame.isGameOver()) {
				const timer = setTimeout(() => {
					try {
						chessGame.move(bestMove);
						const verboseMoves = chessGame.history({verbose: true})
						const latestMove = verboseMoves.at(-1)!;
						commitMoveAndBranch(latestMove?.from, latestMove?.to, latestMove?.promotion)
					} catch {}
				}, 300);
				return () => clearTimeout(timer);
			}
		};
		engineMove();
	}, [bestMove, isPlayingAgainstEngine, playerColor, chessPosition]);

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

	const lastMove = chessGame.history().at(-1) ?? "";

	return {
		options,
		chessPosition,
		setChessPosition,
		chessGameRef,
		chessPGN,
		setChessPGN,
		rootNode: rootNodeRef.current,
		goToNode,
		currentNode,
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
