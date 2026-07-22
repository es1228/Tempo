import { calculateWinProbability } from "../utils/calculateWinProbability";

type EvalBarProps = {
	evaluation: string;
	isFlipped: boolean;
};

const EvalBar = ({ evaluation, isFlipped }: EvalBarProps) => {
	// calculate win probability and format evaluation
	if (!evaluation) evaluation = "0.0";
	const winProbability = calculateWinProbability(evaluation);
	const evalFormatted =
		evaluation === "0.0" ? evaluation : evaluation.substring(1);

	return (
		<div
			id="eval-container"
			className="flex h-auto my-18 w-10 flex-col rounded bg-white border-black border"
			style={{rotate: `${isFlipped ? "180deg" : ""}`}}
		>
			<div
				id="eval-bar"
				className="w-full rounded-t bg-black transition-all duration-300 ease-in-out border-white border"
				style={{ height: `${100 - winProbability * 100}%` }}
			>
				{winProbability < 0.5 && (
					<p className="p-2 text-center text-white" style={{rotate: `${isFlipped ? "180deg" : ""}`}}>
						{evalFormatted}
					</p>
				)}
			</div>
			{winProbability >= 0.5 && (
				<p className="mt-auto p-2 text-center text-black" style={{rotate: `${isFlipped ? "180deg" : ""}`}}>
					{evalFormatted}
				</p>
			)}
		</div>
	);
};
export default EvalBar;
