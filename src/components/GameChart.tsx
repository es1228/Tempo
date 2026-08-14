import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { calculateWinProbability } from "../utils/moveCalculations";
import type { Stats } from "../utils/runGameReview";
import { useMemo } from "react";

type GameChartProps = {
	stats: Stats;
};

type ChartDataPoint = {
	moveNumber: number;
	winProbability: number;
	evaluation: string;
};

const GameChart = ({ stats }: GameChartProps) => {
	if (!stats || !stats.evaluations || stats.evaluations.length === 0)
		return null;

	console.log(stats);

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

			return {
				winProbability,
				moveNumber: index,
				evaluation: validEval,
			};
		});
	}, [stats]);
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary h-20 w-full overflow-hidden rounded">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={data}
					className="bg-black"
					margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
				>
					<XAxis hide dataKey={"moveNumber"} />
					<YAxis hide domain={[0, 100]} />
					<Area
						dataKey={"winProbability"}
						fill="#fff"
						fillOpacity={1}
						stroke="white"
						type="monotone"
					/>
					<Tooltip
						isAnimationActive={false}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const tooltipData = payload[0]
									.payload as ChartDataPoint;
								return (
									<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2">
										<div className="flex items-center gap-2">
											<img
												src={`/ChessIcons/${stats.reviewedMoves?.at(tooltipData.moveNumber)?.classification?.includes(" ") ? stats.reviewedMoves?.at(tooltipData.moveNumber)?.classification.split(" ")[1] : stats.reviewedMoves?.at(tooltipData.moveNumber)?.classification}.png`}
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
											{
												stats.reviewedMoves?.at(
													tooltipData.moveNumber,
												)?.san
											}
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
