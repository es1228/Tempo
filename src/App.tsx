import useStockfish from "./hooks/useStockfish";
import useBoard from "./hooks/useBoard";
import { Chessboard } from "react-chessboard";
import useClassify from "./hooks/useClassify";
import { convertEvaluation } from "./utils/convertEvaluation";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import EvalBar from "./components/EvalBar";

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
			<div className="mx-4 mt-30 flex gap-2 justify-center">
				<EvalBar evaluation={evaluation[evaluation.length - 1]}/>
				<div className="w-auto md:w-120">
					<Chessboard options={options} />
				</div>
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
