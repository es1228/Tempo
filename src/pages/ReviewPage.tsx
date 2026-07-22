import { Chessboard } from "react-chessboard";
import EvalBar from "../components/EvalBar";
import Button from "../components/Button";
import useBoard from "../hooks/useBoard";
import useStockfish from "../hooks/useStockfish";
import { useState } from "react";
import useClassify from "../hooks/useClassify";
import { convertEvaluation } from "../utils/convertEvaluation";
import ImportDialog from "../components/ImportDialog";

const ReviewPage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const {
		options,
		chessPosition,
		chessPGN,
		setChessPGN,
		history,
		goToMove,
		currentMove,
		lastMove
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

	const handleImport = (data: string) => {
		if (!data) return;
		setChessPGN(data);
		setIsDialogOpen(false);
	};

	return (
		<>
			<ImportDialog
				isDialogOpen={isDialogOpen}
				closeDialog={() => setIsDialogOpen(false)}
				handleImport={handleImport}
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
				<Button icon="first_page" onClick={() => goToMove(-1)} />
				<Button
					icon="arrow_back"
					onClick={() => goToMove(currentMove - 1)}
				/>
				<Button
					icon="cached"
					onClick={() => setIsFlipped(!isFlipped)}
				/>
				<Button
					icon="arrow_forward"
					onClick={() => goToMove(currentMove + 1)}
				/>
				<Button
					icon="last_page"
					onClick={() => goToMove(history.length - 1)}
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
export default ReviewPage;
