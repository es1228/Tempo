import useStockfish from "./hooks/useStockfish";
import useBoard from "./hooks/useBoard";
import { Chessboard } from "react-chessboard";
import useClassify from "./hooks/useClassify";
import { convertEvaluation } from "./utils/convertEvaluation";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import EvalBar from "./components/EvalBar";
import Button from "./components/Button";
import { useState } from "react";
import { undoMove } from "./utils/undoMove";

const App = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const { options, chessPosition, setChessPosition, chessGameRef, chessPGN, lastMove } =
		useBoard({
			boardOrientation: isFlipped ? "black" : "white",
		});

	const { bestMove, evaluation, isThinking } = useStockfish({
		fen: chessPosition,
		depth: 18,
		lines: 1,
	});

	const { classification, opening } = useClassify(
		chessPGN,
		bestMove,
		convertEvaluation(evaluation[evaluation.length - 2]),
		convertEvaluation(evaluation[evaluation.length - 1]),
		isThinking,
	);

	const { theme } = useTheme();
	console.log(theme);

	return (
		<>
			<Header />
			<Navbar onClick={() => {}} page="Review" />
			<div className="mx-4 mt-30 flex justify-center gap-2">
				<EvalBar
					evaluation={evaluation[evaluation.length - 1]}
					isFlipped={isFlipped}
				/>
				<div className="w-auto md:w-120">
					<Chessboard options={options} />
				</div>
			</div>
			<div className="flex justify-center">
				<Button
					text="Undo"
					icon="undo"
					onClick={() => setChessPosition(undoMove(chessGameRef.current))}
				/>
				<Button
					text="Flip"
					icon="cached"
					onClick={() => setIsFlipped(!isFlipped)}
				/>
			</div>
			<div className="text-center">
				<p>The Best Move Is: {isThinking ? "Loading..." : bestMove}</p>
				<p>
					{lastMove &&
						`${lastMove} is ${isThinking ? "Loading..." : classification}`}
				</p>
				<p>{opening && `Opening: ${opening}`}</p>
			</div>
		</>
	);
};
export default App;
