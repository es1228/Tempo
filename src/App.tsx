import {
	Chessboard,
	type ChessboardOptions,
	type PieceDropHandlerArgs,
} from "react-chessboard";
import useStockfish from "./hooks/useStockfish";
import { useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { Chess } from "chess.js";

const App = () => {
	const [fen, setFen] = useState<string>(
		"r4Qr1/5N1p/nkn5/4pB2/3r4/6R1/3P4/1K6 w - - 0 1",
	);
	const [input, setInput] = useState<string>("");

	const { bestMove } = useStockfish({
		fen: fen,
		depth: 20,
		lines: 2,
	});

	console.log(`The Best Move is: ${bestMove}`);

	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;
	const [chessPosition, setChessPosition] = useState(chessGame.fen());

	const onPieceDrop = ({
		sourceSquare,
		targetSquare,
	}: PieceDropHandlerArgs) => {
		if (!targetSquare) {
			return false;
		}

		try {
			chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q"
			})
			setChessPosition(chessGame.fen())
			return true;
		}
		catch {
			return false;
		}
	};

	const options: ChessboardOptions = {
		position: chessPosition,
		showAnimations: true,
		onPieceDrop,
		id: "position",
	};

	return (
		<>
			<div className="w-100">
				<Chessboard options={options} />
			</div>
			<form
				onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
					e.preventDefault();
					setFen(input);
				}}
			>
				<input
					type="text"
					placeholder="Enter FEN"
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setInput(e.target.value)
					}
				/>
				<button type="submit">Enter</button>
			</form>
		</>
	);
};
export default App;
