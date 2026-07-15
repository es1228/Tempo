import {
	Chessboard,
	type ChessboardOptions,
	type PieceDropHandlerArgs,
	type SquareHandlerArgs,
} from "react-chessboard";
import useStockfish from "./hooks/useStockfish";
import { useRef, useState, type CSSProperties } from "react";
import { Chess, type Square } from "chess.js";

const App = () => {
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;
	const [chessPosition, setChessPosition] = useState(chessGame.fen());

	const [moveFrom, setMoveFrom] = useState("");
	const [optionSquares, setOptionSquares] = useState({});

	const { bestMove } = useStockfish({
		fen: chessPosition,
		depth: 20,
		lines: 2,
	});

	console.log(`The Best Move is: ${bestMove}`);

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

			// update position
			setChessPosition(chessGame.fen());

			// clear movefrom and optionsquares
			setMoveFrom("");
			setOptionSquares({});

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
			setOptionSquares("");
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

		// update position
		setChessPosition(chessGame.fen());

		// clear movefrom and optionsquares
		setMoveFrom("");
		setOptionSquares({});
	};

	// board options
	const options: ChessboardOptions = {
		position: chessPosition,
		showAnimations: true,
		onPieceDrop,
		onSquareClick,
		squareStyles: optionSquares,
		id: "board",
	};

	return (
		<>
			<div className="w-100">
				<Chessboard options={options} />
			</div>
		</>
	);
};
export default App;
