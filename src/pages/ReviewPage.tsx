import { Chessboard } from "react-chessboard";
import EvalBar from "../components/EvalBar";
import Button from "../components/Button";
import { undoMove } from "../utils/undoMove";
import useBoard from "../hooks/useBoard";
import useStockfish from "../hooks/useStockfish";
import { useState } from "react";
import useClassify from "../hooks/useClassify";
import { convertEvaluation } from "../utils/convertEvaluation";
import ImportDialog from "../components/ImportDialog";

const EvalPage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const {
		options,
		chessPosition,
		setChessPosition,
		chessGameRef,
		chessPGN,
		lastMove,
	} = useBoard({
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

	return (
		<>
			<ImportDialog
				isDialogOpen={isDialogOpen}
				closeDialog={() => setIsDialogOpen(false)}
			/>
			<div className="mt-20 mr-4 mb-4 flex justify-end">
				<Button
					onClick={() => setIsDialogOpen(true)}
					icon="download"
					text="Import"
				/>
			</div>
			<div className="mx-4 flex justify-center gap-2">
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
					icon="first_page"
					onClick={() =>
						setChessPosition(undoMove(chessGameRef.current, true))
					}
				/>
				<Button
					icon="arrow_back"
					onClick={() =>
						setChessPosition(undoMove(chessGameRef.current, false))
					}
				/>
				<Button
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
export default EvalPage;
