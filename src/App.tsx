import useStockfish from "./hooks/useStockfish";
import useBoard from "./hooks/useBoard";
import { Chessboard } from "react-chessboard";

const App = () => {
	const { options, chessPosition } = useBoard();

	const { bestMove } = useStockfish({
		fen: chessPosition,
		depth: 20,
		lines: 2,
	});

	console.log(`The Best Move is: ${bestMove}`);

	return (
		<>
			<div className="w-100">
				<Chessboard options={options} />
			</div>
		</>
	);
};
export default App;
