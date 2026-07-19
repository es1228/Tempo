import { calculateWinProbability } from "../utils/calculateWinProbability";

type EvalBarProps = {
	evaluation: string;
};

const EvalBar = ({ evaluation }: EvalBarProps) => {
	// calculate win probability and format evaluation
	if (!evaluation) evaluation = "0.0";
	const winProbability = calculateWinProbability(evaluation);
	const evalFormatted =
		evaluation === "0.0" ? evaluation : evaluation.substring(1);

	return (
		<div
			id="eval-container"
			className="flex h-auto w-10 flex-col rounded bg-white"
		>
			<div
				id="eval-bar"
				className="w-full rounded-t bg-black transition-all duration-300 ease-in-out"
				style={{ height: `${100 - winProbability * 100}%` }}
			>
				{winProbability < 0.5 && (
					<p className="p-2 text-center text-white">
						{evalFormatted}
					</p>
				)}
			</div>
			{winProbability >= 0.5 && (
				<p className="mt-auto p-2 text-center text-black">
					{evalFormatted}
				</p>
			)}
		</div>
	);
};
export default EvalBar;
