import type { Move } from "chess.js";
import Button from "./Button";
import type { Stats } from "../utils/runGameReview";
import { getMoveColor } from "../utils/getMoveColor";

type HistoryContainerProps = {
	history: Move[];
	currentMove: number;
	goToMove: (index: number) => void;
	stats: Stats;
};

const HistoryContainer = ({
	history,
	currentMove,
	goToMove,
	stats,
}: HistoryContainerProps) => {
	// separate into turns
	const turns = [];
	for (let i = 0; i < history.length; i += 2) {
		turns.push({
			turnNumber: Math.floor(i / 2) + 1,
			white: { move: history[i], index: i },
			black: history[i + 1]
				? { move: history[i + 1], index: i + 1 }
				: null,
		});
	}
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-4">
			<h1>History</h1>
			<hr className="my-2 rounded" />
			<ol className="list-decimal">
				{turns.map(({ turnNumber, white, black }) => {
					return (
						<div
							key={turnNumber}
							className="flex flex-row items-center gap-2"
						>
							<p>{turnNumber}.</p>
							{stats && (
								<img
									src={`/ChessIcons/${
										stats?.reviewedMoves
											?.at(white.index)
											?.classification?.includes(" ")
											? stats?.reviewedMoves
													?.at(white.index)
													?.classification.split(
														" ",
													)[1]
											: stats?.reviewedMoves?.at(
													white.index,
												)?.classification
									}.png`}
									alt={
										stats.reviewedMoves?.at(white.index)
											?.classification
									}
									className="h-6 w-6"
								/>
							)}
							<Button
								text={white.move.san}
								textColor={getMoveColor(stats?.reviewedMoves?.at(white.index)
											?.classification ?? "")}
								onClick={() => goToMove(white.index)}
								isOnBg={currentMove === white.index}
							/>
							{black && (
								<>
									{stats && (
										<img
											src={`/ChessIcons/${
												stats?.reviewedMoves
													?.at(black.index)
													?.classification?.includes(
														" ",
													)
													? stats?.reviewedMoves
															?.at(black.index)
															?.classification.split(
																" ",
															)[1]
													: stats?.reviewedMoves?.at(
															black.index,
														)?.classification
											}.png`}
											alt={
												stats.reviewedMoves?.at(
													black.index,
												)?.classification
											}
											className="h-6 w-6"
										/>
									)}
									<Button
										text={black.move.san}
										textColor={getMoveColor(stats?.reviewedMoves?.at(black.index)
											?.classification ?? "")}
										onClick={() => goToMove(black.index)}
										isOnBg={currentMove === black.index}
									/>
								</>
							)}
						</div>
					);
				})}
			</ol>
		</div>
	);
};
export default HistoryContainer;
