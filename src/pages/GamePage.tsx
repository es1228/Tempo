import { Chessboard } from "react-chessboard";
import useBoard from "../hooks/useBoard";
import PromotionDialog from "../components/PromotionDialog";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import type { Color, PieceSymbol, Square } from "chess.js";
import PlayerContainer from "../components/PlayerContainer";
import { useEffect, useState } from "react";
import GameOptionsDialog from "../components/GameOptionsDialog";
import useChessTimer from "../hooks/useChessTimer";
import TimeContainer from "../components/TimeContainer";
import GameResult from "../components/GameResult";
import getGameResult from "../utils/getGameResult";
import { useCustomFen } from "../globalContext";
import Button from "../components/Button";

const GamePage = () => {
	const [isFlipped, setIsFlipped] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
	const [whiteText, setWhiteText] = useState<string>("");
	const [blackText, setBlackText] = useState<string>("");
	const [initialTime, setInitialTime] = useState<number>();
	const [bonusTime, setBonusTime] = useState<number>();
	const [autoRotate, setAutoRotate] = useState<boolean>(false);
	const [isUsingCustomPosition, setIsUsingCustomPosition] =
		useState<boolean>(false);
	const [isPlayingAgainstEngine, setIsPlayingAgainstEngine] =
		useState<boolean>(false);
	const [playerColor, setPlayerColor] = useState<Color>("w");
	const [engineStrength, setEngineStrength] = useState<number>(20);

	const { customFen } = useCustomFen();

	const startGame = (
		inputWhiteText: string,
		inputBlackText: string,
		inputTime: number | undefined,
		inputBonusTime: number | undefined,
		inputAutoRotate: boolean,
		inputCustomPos: boolean,
		inputPlayingEngine: boolean,
		inputPlayerColor: Color,
		inputEngineStrength: number,
	) => {
		setWhiteText(inputWhiteText.trim() || "White");
		setBlackText(inputBlackText.trim() || "Black");
		setInitialTime(Math.abs(inputTime ?? Infinity));
		isNaN(inputTime ?? 0) && setInitialTime(Infinity);
		setBonusTime(Math.abs(inputBonusTime ?? 0));
		setAutoRotate(inputAutoRotate);
		setIsUsingCustomPosition(inputCustomPos);
		setIsPlayingAgainstEngine(inputPlayingEngine);
		setPlayerColor(inputPlayerColor);
		setEngineStrength(inputEngineStrength);
		resetBoard(inputCustomPos);
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
		isPlayingAgainstEngine: isPlayingAgainstEngine,
		playerColor: playerColor,
		engineStrength: engineStrength,
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
		!isDialogOpen && !chessGameRef.current.isGameOver(),
	);

	useEffect(() => {
		const prevPlayer = checkActivePlayer(chessPosition) === "w" ? "b" : "w";
		handleMoveMade(prevPlayer);
	}, [chessPosition]);

	const resetBoard = (isCustomPos: boolean) => {
		if (isCustomPos && customFen) chessGameRef.current.load(customFen);
		else chessGameRef.current.reset();

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
							{initialTime && initialTime !== Infinity && (
								<TimeContainer
									text={whiteTimeRemaining.toString()}
								/>
							)}
						</div>
					) : (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={blackText} />
							{initialTime && initialTime !== Infinity && (
								<TimeContainer
									text={blackTimeRemaining.toString()}
								/>
							)}
						</div>
					)}
					<div className="fixed right-10 bg-on-bg dark:bg-on-bg-dark rounded-full">
						<Button
							icon="cached"
							onClick={() => setIsFlipped(!isFlipped)}
						/>
					</div>
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
								result={gameResult ?? ""}
								handleRematch={() => {
									resetClocks();
									resetBoard(isUsingCustomPosition);
									startGame(
										whiteText,
										blackText,
										initialTime,
										bonusTime,
										autoRotate,
										isUsingCustomPosition,
										isPlayingAgainstEngine,
										playerColor,
										engineStrength,
									);
								}}
								handleNewGame={() => {
									resetClocks();
									resetBoard(isUsingCustomPosition);
									setIsDialogOpen(true);
								}}
								handleCopy={() =>
									navigator.clipboard.writeText(
										chessGameRef.current.pgn(),
									)
								}
								isDialogOpen={!!gameResult}
							/>
						)}
					</div>
					{isFlipped ? (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={blackText} />
							{initialTime && initialTime !== Infinity && (
								<TimeContainer
									text={blackTimeRemaining.toString()}
								/>
							)}
						</div>
					) : (
						<div className="flex flex-row items-center gap-2">
							<PlayerContainer text={whiteText} />
							{initialTime && initialTime !== Infinity && (
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
