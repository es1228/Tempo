import type { PV } from "../types/PV";
import { checkActivePlayer } from "../utils/checkActivePlayer";
import { convertLineToSan } from "../utils/convertLineToSan";

type LinesContainerProps = {
	chessPosition: string;
	pv: PV[];
};

const LinesContainer = ({ chessPosition, pv }: LinesContainerProps) => {
	const formatter = new Intl.NumberFormat("en-us", { signDisplay: "always" });
	const activePlayer = checkActivePlayer(chessPosition);
	let score1 =
		activePlayer === "w"
			? formatter.format(pv[0]?.score / 100)
			: formatter.format(pv[0]?.score / -100);
	let score2 =
		activePlayer === "w"
			? formatter.format(pv[1]?.score / 100)
			: formatter.format(pv[1]?.score / -100);

	if (pv[0]?.mate) score1 = `${score1[0]}M${Math.abs(pv[0]?.score)}`;
	if (pv[1]?.mate) score2 = `${score2[0]}M${Math.abs(pv[1]?.score)}`;

	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary w-fit space-y-2 rounded-3xl p-4">
			<h1>Engine</h1>
			<hr className="my-2 rounded" />
			<div className="block max-w-full overflow-auto lg:max-w-65">
				<p
					className="float-left mr-2 h-fit w-fit rounded-3xl p-2 text-sm"
					style={
						score1.at(0) === "+"
							? { backgroundColor: "white", color: "black" }
							: { backgroundColor: "black", color: "white" }
					}
				>
					{score1}
				</p>
				<p className="text-justify text-sm text-wrap h-full mt-2">
					{convertLineToSan(pv[0]?.moves, chessPosition)}
				</p>
			</div>
			<hr className="my-2 rounded" />
			<div className="block max-w-full overflow-auto lg:max-w-65">
				<p
					className="float-left mr-2 h-fit w-fit rounded-3xl p-2 text-sm"
					style={
						score2.at(0) === "+"
							? { backgroundColor: "white", color: "black" }
							: { backgroundColor: "black", color: "white" }
					}
				>
					{score2}
				</p>
				<p className="text-justify text-sm text-wrap">
					{convertLineToSan(pv[1]?.moves, chessPosition)}
				</p>
			</div>
		</div>
	);
};
export default LinesContainer;
