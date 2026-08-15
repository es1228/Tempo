import {
	Area,
	AreaChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { calculateWinProbability } from "../utils/moveCalculations";
import type { Stats } from "../utils/runGameReview";
import { useMemo, useState } from "react";
import { getMoveColor } from "../utils/getMoveColor";

type GameChartProps = {
	stats: Stats;
	goToMove: (moveNumber: number) => void;
	currentMoveNumber: number;
};

type ChartDataPoint = {
	moveNumber: number;
	winProbability: number;
	evaluation: string;
	classification: string;
};

const CustomDot = ({ cx, cy, payload, currentMoveNumber }: any) => {
	const classification: string = payload.classification;
	const isCurrentMove = payload.moveNumber === currentMoveNumber;

	if (!classification) return null;

	const targetClassifications = [
		"brilliant",
		"great",
		"a mistake",
		"a blunder",
		"a miss",
	];
	const shouldShow = targetClassifications.some((target) =>
		classification.includes(target),
	);

	if (!shouldShow && !isCurrentMove) return null;

	const dotColor = getMoveColor(
		classification.split(" ").at(1) ?? classification,
	);

	return (
		<circle
			cx={cx}
			cy={cy}
			r={4}
			fill={dotColor}
			className="focus:outline-hidden"
		/>
	);
};

const ActiveDot = ({ cx, cy, payload, goToMove }: any) => {
	const classification: string = payload.classification;

	if (!classification) return null;

	const dotColor = getMoveColor(
		classification.split(" ").at(1) ?? classification,
	);

	return (
		<circle
			cx={cx}
			cy={cy}
			r={4}
			fill={dotColor}
			onClick={(e) => {
				e.stopPropagation();
				goToMove(payload.moveNumber);
			}}
			className="focus:outline-hidden"
		/>
	);
};

const GameChart = ({ stats, goToMove, currentMoveNumber }: GameChartProps) => {
	if (!stats || !stats.evaluations || stats.evaluations.length === 0)
		return null;

	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const data: ChartDataPoint[] = useMemo(() => {
		return stats.evaluations.map((evaluation, index) => {
			let winProbability = 50;
			let validEval = "+0.0";
			try {
				validEval =
					!evaluation || typeof evaluation !== "string"
						? "+0.0"
						: evaluation;
				const calculated = calculateWinProbability(validEval) * 100;
				winProbability = isNaN(calculated)
					? 50
					: Math.max(0, Math.min(100, Number(calculated.toFixed(2))));
			} catch {
				console.error("Could not parse chart evaluation");
			}

			const classification =
				index === 0
					? "theory"
					: (stats.reviewedMoves?.at(index - 1)?.classification ??
						"Unknown");

			return {
				winProbability,
				moveNumber: index - 1,
				evaluation: validEval,
				classification,
			};
		});
	}, [stats]);
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary h-20 w-full overflow-hidden rounded-lg p-1">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={data}
					className="overflow-hidden rounded-lg bg-black hover:cursor-pointer focus:outline-hidden"
					margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
					onMouseMove={(state) => {
						if (state && state.activeTooltipIndex !== undefined)
							setActiveIndex(Number(state.activeTooltipIndex));
					}}
					onMouseLeave={() => setActiveIndex(null)}
					onClick={() => {
						if (activeIndex !== null && data[activeIndex])
							goToMove(data[activeIndex].moveNumber);
					}}
				>
					<XAxis hide dataKey={"moveNumber"} />
					<YAxis hide domain={[0, 100]} />
					<ReferenceLine
						y={50}
						stroke="#6b7280"
						strokeWidth={2}
						strokeOpacity={0.5}
					/>
					<ReferenceLine
						x={currentMoveNumber}
						stroke={
							currentMoveNumber === -1
								? getMoveColor("theory")
								: getMoveColor(
										stats.reviewedMoves
											.at(currentMoveNumber)
											?.classification.split(" ")
											.at(1) ??
											stats.reviewedMoves.at(
												currentMoveNumber,
											)?.classification ??
											"Loading",
									)
						}
						strokeWidth={2}
					/>
					<Area
						dataKey={"winProbability"}
						fill="#fff"
						fillOpacity={1}
						stroke="white"
						type="monotone"
						dot={
							<CustomDot currentMoveNumber={currentMoveNumber} />
						}
						activeDot={<ActiveDot goToMove={goToMove} />}
					/>
					<Tooltip
						isAnimationActive={false}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const tooltipData = payload[0]
									.payload as ChartDataPoint;
									
								const shortClassification = stats.reviewedMoves
									?.at(tooltipData.moveNumber)
									?.classification?.includes(" ")
									? stats.reviewedMoves
											?.at(tooltipData.moveNumber)
											?.classification.split(" ")[1]
									: stats.reviewedMoves?.at(
											tooltipData.moveNumber,
										)?.classification;

								return (
									<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2">
										<div className="flex items-center gap-2">
											<img
												src={`/ChessIcons/${tooltipData.moveNumber === -1 ? "theory" : shortClassification}.png`}
												alt={
													stats.reviewedMoves?.at(
														tooltipData.moveNumber,
													)?.classification
												}
												className="h-6 w-6"
											/>
											<p>{tooltipData.evaluation}</p>
										</div>
										<p>
											{tooltipData.moveNumber === -1
												? "Start"
												: stats.reviewedMoves?.at(
														tooltipData.moveNumber,
													)?.san}
										</p>
									</div>
								);
							}
							return null;
						}}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};
export default GameChart;
