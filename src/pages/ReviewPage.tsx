import { Chessboard } from "react-chessboard";
import EvalBar from "../components/EvalBar";
import Button from "../components/Button";
import useBoard from "../hooks/useBoard";
import {
	useCallback,
	useMemo,
	useState,
	type CSSProperties,
	type ReactNode,
} from "react";
import useClassify from "../hooks/useClassify";
import ImportDialog from "../components/ImportDialog";
import PlayerContainer from "../components/PlayerContainer";
import MoveFeedbackContainer from "../components/MoveFeedbackContainer";
import HistoryContainer from "../components/HistoryContainer";
import PromotionDialog from "../components/PromotionDialog";
import type { PieceSymbol, Square } from "chess.js";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import { runGameReview, type Stats } from "../utils/runGameReview";
import useEvalCache from "../hooks/useEvalCache";
import { getMoveColor } from "../utils/getMoveColor";
import LinesContainer from "../components/LinesContainer";
import ClassificationContainer from "../components/ClassificationContainer";
import AccuracyContainer from "../components/AccuracyContainer";
import GameChart from "../components/GameChart";
import GameReviewLoadingDialog from "../components/GameReviewLoadingDialog";

const ReviewPage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isReviewInProgress, setIsReviewInProgress] = useState<boolean>(false);

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
		onPromotionPieceSelect,
		whitePlayer,
		blackPlayer,
		whiteElo,
		blackElo,
	} = useBoard({
		boardOrientation: isFlipped ? "black" : "white",
	});

	const { getCachedEval, setCachedEval } = useEvalCache();

	const { classification, opening, prevBestMove, evaluation, pv } =
		useClassify(chessPGN, getCachedEval, setCachedEval);

	const [stats, setStats] = useState<Stats>();

	const handleImport = async (data: string) => {
		if (!data) return;
		setChessPGN(data);
		setIsDialogOpen(false);
		setIsReviewInProgress(true);
		const result = await runGameReview(data, getCachedEval, setCachedEval);
		setIsReviewInProgress(false);
		setStats(result);
		console.log(result);
	};

	const [panel, setPanel] = useState<"Report" | "Analysis">("Analysis");

	const memoizedSquareRenderer = useCallback(
		({ square, children }: { square: string; children?: ReactNode }) => {
			const moveClass = classification.split(" ").at(-1) ?? "Loading";
			const squareStyle = options.squareStyles?.[square] ?? {};
			const moveColor = getMoveColor(classification);
			const startSquare = history?.at(currentMove)?.from;
			const endSquare = history?.at(currentMove)?.to;
			const highlightStyle: CSSProperties =
				currentMove >= 0 &&
				(square === startSquare || square === endSquare)
					? {
							backgroundColor: `color-mix(in oklch, ${moveColor} 40%, transparent)`,
						}
					: {};

			return (
				<div
					className="relative h-full w-full overflow-visible"
					style={{
						...squareStyle,
						...highlightStyle,
					}}
				>
					{children}
					{currentMove >= 0 && square === endSquare && (
						<img
							src={`/ChessIcons/${moveClass}.png`}
							alt={classification}
							className="pointer-events-none absolute -top-3 -right-3 z-50 h-6 w-6 overflow-visible md:-top-4 md:-right-4 md:h-8 md:w-8"
						/>
					)}
				</div>
			);
		},
		[classification, options.squareStyles, history, currentMove],
	);

	const memoizedOptions = useMemo(() => {
		return {
			...options,
			squareRenderer: memoizedSquareRenderer,
		};
	}, [options, memoizedSquareRenderer]);

	return (
		<>
			<GameReviewLoadingDialog isOpen={isReviewInProgress}/>
			<ImportDialog
				values={["Chess.com", "PGN", "FEN"]}
				isDialogOpen={isDialogOpen}
				closeDialog={() => setIsDialogOpen(false)}
				handleImport={handleImport}
			/>
			<div className="flex flex-col lg:mr-5 lg:ml-60 lg:flex-row lg:justify-between">
				<div className="mx-4 mt-22 flex justify-center gap-2">
					<EvalBar evaluation={evaluation} isFlipped={isFlipped} />
					<div className="flex flex-col justify-start">
						{isFlipped ? (
							<PlayerContainer
								text={
									whitePlayer
										? `${whitePlayer} (${whiteElo})`
										: "White"
								}
							/>
						) : (
							<PlayerContainer
								text={
									blackPlayer
										? `${blackPlayer} (${blackElo})`
										: "Black"
								}
							/>
						)}
						<div className="w-auto md:w-120">
							<Chessboard options={memoizedOptions} />
							<PromotionDialog
								isDialogOpen={!!promotionMove}
								onSelect={(p: PieceSymbol) =>
									onPromotionPieceSelect(p)
								}
								square={promotionMove?.to as Square}
								moveColor={checkActivePlayer(chessPosition)}
							/>
						</div>
						{isFlipped ? (
							<PlayerContainer
								text={
									blackPlayer
										? `${blackPlayer} (${blackElo})`
										: "Black"
								}
							/>
						) : (
							<PlayerContainer
								text={
									whitePlayer
										? `${whitePlayer} (${whiteElo})`
										: "White"
								}
							/>
						)}
					</div>
				</div>
				<div className="bg-on-bg dark:bg-on-bg-dark mx-4 mb-40 flex flex-col justify-center gap-2 overflow-auto rounded-3xl p-2 lg:mt-40 lg:mr-10 lg:mb-0 lg:h-120 lg:w-fit lg:scale-125">
					<div className="space-y-2 overflow-auto">
						<div className="flex flex-row items-center justify-between">
							<h1 className="p-2 text-2xl">Game Review</h1>
							<Button
								onClick={() => setIsDialogOpen(true)}
								icon="download"
								text="Import"
								isSecondary
							/>
						</div>
						<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary flex items-center justify-between rounded-3xl p-2">
							<Button
								onClick={() => setPanel("Analysis")}
								text="Analysis"
								icon="search"
								isPrimary={panel === "Analysis"}
								isSecondary={panel !== "Analysis"}
							/>
							<div className="bg-text dark:bg-text-dark h-8 w-0.5 rounded-3xl"></div>
							<Button
								onClick={() => setPanel("Report")}
								text="Report"
								icon="description"
								isPrimary={panel === "Report"}
								isSecondary={panel !== "Report"}
							/>
						</div>
						{panel === "Analysis" && (
							<>
								<MoveFeedbackContainer
									feedback={`${
										lastMove &&
										`${lastMove} is ${classification}`
									}`}
									best={
										prevBestMove &&
										classification !== "best" &&
										classification !== "great" &&
										classification !== "brilliant" &&
										classification !== "forced" &&
										classification !== "theory"
											? `The Best Move was ${prevBestMove}`
											: ""
									}
									opening={`${opening && `${opening}`}`}
								/>
								<LinesContainer
									chessPosition={chessPosition}
									pv={pv}
								/>
								<HistoryContainer
									history={history}
									currentMove={currentMove}
									goToMove={goToMove}
									stats={stats!}
								/>
							</>
						)}
						{panel === "Report" && (
							<>
								<GameChart stats={stats!} goToMove={goToMove} currentMoveNumber={currentMove}/>
								<AccuracyContainer stats={stats!} />
								<ClassificationContainer
									stats={stats!}
									whiteName={whitePlayer}
									blackName={blackPlayer}
								/>
							</>
						)}
					</div>
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
