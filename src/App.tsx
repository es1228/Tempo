import useStockfish from "./hooks/useStockfish";
import useBoard from "./hooks/useBoard";
import { Chessboard } from "react-chessboard";

const App = () => {
	const { options, chessPosition } = useBoard();

	const { bestMove, isThinking } = useStockfish({
		fen: chessPosition,
		depth: 18,
		lines: 1,
	});

	return (
		<>
			<div className="w-100">
				<Chessboard options={options} />
			</div>
			<p>The Best Move Is: {isThinking ? "Loading..." : bestMove}</p>
		</>
	);
};
export default App;
