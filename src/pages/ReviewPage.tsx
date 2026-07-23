import { Chessboard } from "react-chessboard";
import EvalBar from "../components/EvalBar";
import Button from "../components/Button";
import useBoard from "../hooks/useBoard";
import useStockfish from "../hooks/useStockfish";
import { useEffect, useState } from "react";
import useClassify from "../hooks/useClassify";
import { convertEvaluation } from "../utils/convertEvaluation";
import ImportDialog from "../components/ImportDialog";
import PlayerContainer from "../components/PlayerContainer";
import MoveFeedbackContainer from "../components/MoveFeedbackContainer";
import HistoryContainer from "../components/HistoryContainer";

const ReviewPage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [gameBestMoves, setGameBestMoves] = useState<Record<number, string>>([]);

	const {
		options,
		chessPosition,
		chessPGN,
		setChessPGN,
		history,
		goToMove,
		currentMove,
		lastMove,
	} = useBoard({
		boardOrientation: isFlipped ? "black" : "white",
	});

	const { bestMove, evaluation, isThinking } = useStockfish({
		fen: chessPosition,
		depth: 18,
		lines: 1,
	});

	const prevBestMove = gameBestMoves[currentMove - 1];

	const { classification, opening } = useClassify(
		chessPGN,
		prevBestMove,
		convertEvaluation(evaluation.at(-3) ?? "0"),
		convertEvaluation(evaluation.at(-2) ?? "0"),
		convertEvaluation(evaluation.at(-1) ?? "0"),
		isThinking,
	);

	const handleImport = (data: string) => {
		if (!data) return;
		setChessPGN(data);
		setIsDialogOpen(false);
	};

	useEffect(() => {
		if (!isThinking && bestMove)
			setGameBestMoves((prev) => ({ ...prev, [currentMove]: bestMove }));
	}, [isThinking, bestMove, currentMove]);

	return (
		<>
			<ImportDialog
				isDialogOpen={isDialogOpen}
				closeDialog={() => setIsDialogOpen(false)}
				handleImport={handleImport}
			/>
			<div className="flex flex-col lg:mr-5 lg:ml-60 lg:flex-row lg:justify-between">
				<div className="mx-4 mt-22 flex justify-center gap-2">
					<EvalBar
						evaluation={evaluation[evaluation.length - 1]}
						isFlipped={isFlipped}
					/>
					<div className="flex flex-col justify-start">
						{isFlipped ? (
							<PlayerContainer text="White" />
						) : (
							<PlayerContainer text="Black" />
						)}
						<div className="w-auto md:w-120">
							<Chessboard options={options} />
						</div>
						{isFlipped ? (
							<PlayerContainer text="Black" />
						) : (
							<PlayerContainer text="White" />
						)}
					</div>
				</div>
				<div className="bg-on-bg dark:bg-on-bg-dark mx-4 mb-40 flex flex-col justify-center gap-2 rounded-3xl p-2 lg:mt-40 lg:mr-10 lg:mb-0 lg:h-120 lg:w-fit lg:scale-125">
					<div className="flex flex-row items-center justify-between">
						<h1 className="p-2 text-2xl">Game Review</h1>
						<Button
							onClick={() => setIsDialogOpen(true)}
							icon="download"
							text="Import"
							isSecondary
						/>
					</div>
					<MoveFeedbackContainer
						feedback={`${
							lastMove &&
							`${lastMove} is ${isThinking ? "Loading" : classification}`
						}`}
						best={
							prevBestMove &&
							!isThinking &&
							classification !== "best" &&
							classification !== "theory"
								? `The Best Move was ${prevBestMove}`
								: ""
						}
						opening={`${opening && `${opening}`}`}
					/>
					<HistoryContainer history={history} goToMove={goToMove} />
					<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary mt-auto flex flex-row justify-center gap-2 rounded-3xl p-2">
						<Button
							icon="first_page"
							onClick={() => goToMove(-1)}
						/>
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
				</div>
			</div>
		</>
	);
};
export default ReviewPage;
