import { Chessboard } from "react-chessboard";
import useBoard from "../hooks/useBoard";
import PromotionDialog from "../components/PromotionDialog";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import type { PieceSymbol, Square } from "chess.js";
import PlayerContainer from "../components/PlayerContainer";
import { useEffect, useState } from "react";
import GameOptionsDialog from "../components/GameOptionsDialog";
import useChessTimer from "../hooks/useChessTimer";
import TimeContainer from "../components/TimeContainer";
import GameResult from "../components/GameResult";
import getGameResult from "../utils/getGameResult";

const GamePage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
	const [whiteText, setWhiteText] = useState<string>("");
	const [blackText, setBlackText] = useState<string>("");
	const [initialTime, setInitialTime] = useState<number>();
	const [bonusTime, setBonusTime] = useState<number>();
	const [autoRotate, setAutoRotate] = useState<boolean>(true);

	const startGame = (
		inputWhiteText: string,
		inputBlackText: string,
		inputTime: number | undefined,
		inputBonusTime: number | undefined,
		inputAutoRotate: boolean,
	) => {
		setWhiteText(inputWhiteText.trim() || "White");
		setBlackText(inputBlackText.trim() || "Black");
		setInitialTime(Math.abs(inputTime ?? Infinity));
		isNaN(inputTime ?? 0) && setInitialTime(Infinity);
		setBonusTime(Math.abs(inputBonusTime ?? 0));
		setAutoRotate(inputAutoRotate);
		setIsDialogOpen(false);
	};

	const {
		options,
		chessGameRef,
		chessPosition,
		setChessPosition,
		promotionMove,
		onPromotionPieceSelect,
	} = useBoard({
		boardOrientation: isFlipped ? "black" : "white",
	});

	useEffect(() => {
		if (autoRotate)
			checkActivePlayer(chessPosition) === "b"
				? setIsFlipped(true)
				: setIsFlipped(false);
	}, [chessPosition]);

	const {
		whiteTimeRemaining,
		blackTimeRemaining,
		handleMoveMade,
		resetClocks,
	} = useChessTimer(
		initialTime ?? Infinity,
		bonusTime ?? 0,
		checkActivePlayer(chessPosition),
		!isDialogOpen
	);

	useEffect(() => {
		const prevPlayer = checkActivePlayer(chessPosition) === "w" ? "b" : "w";
		handleMoveMade(prevPlayer);
	}, [chessPosition]);

	const resetBoard = () => {
		chessGameRef.current.reset();
		setChessPosition(chessGameRef.current.fen());
	};

	const gameResult = getGameResult(
		chessGameRef.current,
		whiteText,
		blackText,
		whiteTimeRemaining,
		blackTimeRemaining,
	);

	return (
		<div className="flex flex-col">
			<GameOptionsDialog
				isDialogOpen={isDialogOpen}
				startGame={startGame}
			/>
			<div className="mx-4 mt-22 flex justify-center gap-2">
				<div className="flex flex-col justify-start">
					{isFlipped ? (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={whiteText} />
							{initialTime !== Infinity && (
								<TimeContainer
									text={whiteTimeRemaining.toString()}
								/>
							)}
						</div>
					) : (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={blackText} />
							{initialTime !== Infinity && (
								<TimeContainer
									text={blackTimeRemaining.toString()}
								/>
							)}
						</div>
					)}
					<div className="relative w-auto md:w-120">
						<Chessboard options={options} />
						<PromotionDialog
							isDialogOpen={!!promotionMove}
							onSelect={(p: PieceSymbol) =>
								onPromotionPieceSelect(p)
							}
							square={promotionMove?.to as Square}
							moveColor={checkActivePlayer(chessPosition)}
						/>
						{gameResult && (
							<GameResult
								result={gameResult}
								handleRematch={() => {
									resetClocks();
									resetBoard();
									startGame(
										whiteText,
										blackText,
										initialTime,
										bonusTime,
										autoRotate,
									);
								}}
								handleNewGame={() => {
									resetClocks();
									resetBoard();
									setIsDialogOpen(true);
								}}
								handleCopy={() =>
									navigator.clipboard.writeText(
										chessGameRef.current.pgn(),
									)
								}
							/>
						)}
					</div>
					{isFlipped ? (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={blackText} />
							{initialTime !== Infinity && (
								<TimeContainer
									text={blackTimeRemaining.toString()}
								/>
							)}
						</div>
					) : (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={whiteText} />
							{initialTime !== Infinity && (
								<TimeContainer
									text={whiteTimeRemaining.toString()}
								/>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default GamePage;
