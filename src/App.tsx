import useStockfish from "./hooks/useStockfish";
import useBoard from "./hooks/useBoard";
import { Chessboard } from "react-chessboard";
import useClassify from "./hooks/useClassify";

const App = () => {
	const { options, chessPosition, chessPGN, lastMove } = useBoard();

	const { bestMove, evaluation, isThinking } = useStockfish({
		fen: chessPosition,
		depth: 18,
		lines: 1,
	});

	const { classification, opening } = useClassify(
		chessPGN,
		bestMove,
		Number(evaluation[evaluation.length - 2]),
		Number(evaluation[evaluation.length - 1]),
		isThinking
	);

	return (
		<>
			<div className="w-100">
				<Chessboard options={options} />
			</div>
			<p>The Best Move Is: {isThinking ? "Loading..." : bestMove}</p>
			<p>Evaluation: {evaluation[evaluation.length - 1]}</p>
			<p>{lastMove && `${lastMove} is ${isThinking ? "Loading..." : classification}`}</p>
			<p>{opening && `Opening: ${opening}`}</p>
		</>
	);
};
export default App;
