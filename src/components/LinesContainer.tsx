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
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary w-full space-y-2 rounded-3xl p-4">
			<h1>Engine</h1>
			<hr className="my-2 rounded" />
			<div className="max-w-full items-center space-y-4 overflow-auto lg:max-w-65">
				{pv
					.filter((pv) => pv !== null)
					.map((pv) => {
						let score =
							activePlayer === "w"
								? formatter.format(pv.score / 100)
								: formatter.format(pv.score / -100);
						if (pv.mate)
							score = `${score1[0]}M${Math.abs(pv.score)}`;

						return (
							<div className="flex items-center">
								<p
									className="float-left mr-2 h-fit w-fit rounded-3xl p-2 text-sm"
									style={
										score.at(0) === "+"
											? {
													backgroundColor: "white",
													color: "black",
												}
											: {
													backgroundColor: "black",
													color: "white",
												}
									}
								>
									{score1}
								</p>
								<p>
									{convertLineToSan(pv.moves, chessPosition)
										?.split(" ")
										.splice(0, 6)
										.join(" ")}
								</p>
							</div>
						);
					})}
			</div>
		</div>
	);
};
export default LinesContainer;
