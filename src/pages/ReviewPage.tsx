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
import { type AnalysisCache } from "../types/AnalysisCache";
import PromotionDialog from "../components/PromotionDialog";
import type { PieceSymbol, Square } from "chess.js";
import { checkActivePlayer } from "../utils/checkActivePlayer";

const ReviewPage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [gameCache, setGameCache] = useState<Record<number, AnalysisCache>>({})

	const {
		options,
		chessPosition,
		chessPGN,
		setChessPGN,
		history,
		goToMove,
		currentMove,
		lastMove,
		promotionMove,
		onPromotionPieceSelect
	} = useBoard({
		boardOrientation: isFlipped ? "black" : "white",
	});

	const { bestMove, evaluation, pv, isThinking } = useStockfish({
		fen: chessPosition,
		depth: 20,
		lines: 2,
	});

	useEffect(() => {
		if (!isThinking && bestMove && evaluation) {
			setGameCache(prev => ({
				...prev,
				[currentMove]: {
					bestMove,
					evaluation, 
					pv,
				}
			}));
		}
	}, [isThinking, bestMove, evaluation, pv, currentMove])

	const prevAnalysis = gameCache[currentMove - 1];

	const evalAtCurrent = gameCache[currentMove]?.evaluation ?? evaluation ?? "+0.0";
	const evalAtPrev = gameCache[currentMove - 1]?.evaluation ?? "+0.0";
	const evalAtPrev2 = gameCache[currentMove - 2]?.evaluation ?? "+0.0";

	const { classification, opening } = useClassify(
		chessPGN,
		prevAnalysis?.bestMove,
		convertEvaluation(evalAtPrev2),
		convertEvaluation(evalAtPrev),
		convertEvaluation(evalAtCurrent),
		prevAnalysis?.pv?.[0],
		prevAnalysis?.pv?.[1],
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
			<div className="flex flex-col lg:mr-5 lg:ml-60 lg:flex-row lg:justify-between">
				<div className="mx-4 mt-22 flex justify-center gap-2">
					<EvalBar
						evaluation={evaluation}
						isFlipped={isFlipped}
					/>
					<div className="flex flex-col justify-start">
						{isFlipped ? (
							<PlayerContainer text="White" />
						) : (
							<PlayerContainer text="Black" />
						)}
						<div className="w-auto md:w-120">
							<Chessboard
								options={{
									...options,
									squareRenderer: ({ square, children }) => {
										const moveClass =
											classification.split(" ").at(-1) ??
											"Loading";
										const squareStyle =
											options.squareStyles?.[square] ??
											{};
										const endSquare =
											history?.at(currentMove)?.to;

										return (
											<div
												className="relative h-full w-full overflow-visible z-100"
												style={squareStyle}
											>
												{children}
												{currentMove >= 0 && square === endSquare && (
													<img
														src={`/ChessIcons/${moveClass}.png`}
														alt={classification}
														className="pointer-events-none absolute -top-3 -right-3 z-100 h-6 w-6 md:-top-4 md:-right-4 md:h-8 md:w-8 overflow-visible"
													/>
												)}
											</div>
										);
									},
								}}
							/>
							<PromotionDialog isDialogOpen={!!promotionMove} onSelect={(p: PieceSymbol) => onPromotionPieceSelect(p)} square={promotionMove?.to as Square} moveColor={checkActivePlayer(chessPosition)}/>
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
							prevAnalysis?.bestMove &&
							!isThinking &&
							classification !== "best" &&
							classification !== "theory"
								? `The Best Move was ${prevAnalysis?.bestMove}`
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
