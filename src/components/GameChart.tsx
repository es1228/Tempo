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
import type { MoveNode } from "../types/HistoryTree";
import { getMainlineNodes } from "../utils/getMainlineNodes";

type GameChartProps = {
	stats: Stats;
	rootNode: MoveNode;
	goToNode: (node: MoveNode) => void;
	currentNode: MoveNode;
};

type ChartDataPoint = {
	node: MoveNode;
	winProbability: number;
	evaluation: string;
	classification: string;
};

const CustomDot = ({ cx, cy, payload, node }: any) => {
	const classification: string = payload.classification;
	const isCurrentMove = payload.node === node;

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

const ActiveDot = ({ cx, cy, payload, goToNode }: any) => {
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
				goToNode(payload.node);
			}}
			className="focus:outline-hidden"
		/>
	);
};

const GameChart = ({ stats, goToNode, rootNode, currentNode }: GameChartProps) => {
	if (!stats || !stats.evaluations || stats.evaluations.length === 0)
		return null;

	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const mainlineNodes = getMainlineNodes(rootNode)

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
				node: mainlineNodes[index],
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
							goToNode(data[activeIndex].node);
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
						x={mainlineNodes.indexOf(currentNode) + 1}
						stroke={
							currentNode.parent === null
								? getMoveColor("theory")
								: getMoveColor(
										stats.reviewedMoves
											.at(mainlineNodes.indexOf(currentNode) + 1)
											?.classification.split(" ")
											.at(1) ??
											stats.reviewedMoves.at(
												mainlineNodes.indexOf(currentNode) + 1,
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
							<CustomDot node={currentNode} />
						}
						activeDot={<ActiveDot goToNode={goToNode} />}
					/>
					<Tooltip
						isAnimationActive={false}
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const tooltipData = payload[0]
									.payload as ChartDataPoint;

								const shortClassification = stats.reviewedMoves
									?.at(mainlineNodes.indexOf(tooltipData.node) + 1)
									?.classification?.includes(" ")
									? stats.reviewedMoves
											?.at(mainlineNodes.indexOf(tooltipData.node) + 1)
											?.classification.split(" ")[1]
									: stats.reviewedMoves?.at(
											mainlineNodes.indexOf(tooltipData.node) + 1,
										)?.classification;

								return (
									<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2">
										<div className="flex items-center gap-2">
											<img
												src={`/ChessIcons/${tooltipData.node.parent === null ? "theory" : shortClassification}.png`}
												alt={
													stats.reviewedMoves?.at(
														mainlineNodes.indexOf(tooltipData.node) + 1,
													)?.classification
												}
												className="h-6 w-6"
											/>
											<p>{tooltipData.evaluation}</p>
										</div>
										<p>
											{tooltipData.node.parent === null
												? "Start"
												: stats.reviewedMoves?.at(
														mainlineNodes.indexOf(tooltipData.node) + 1
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
