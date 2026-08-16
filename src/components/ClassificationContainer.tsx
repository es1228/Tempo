import { getMoveColor } from "../utils/getMoveColor";
import type { Stats } from "../utils/runGameReview";

type ClassificationContainerProps = {
	stats: Stats;
    whiteName: string;
    blackName: string;
};

const ClassificationContainer = ({ stats, whiteName, blackName }: ClassificationContainerProps) => {
	if (!stats) return;
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary w-full space-y-2 rounded-3xl p-4">
			<h1>Classifications</h1>
			<hr className="my-2 rounded" />
			<table className="w-full border-separate border-spacing-x-4 text-sm">
                <thead>
                    <tr className="w-full">
                        <th></th>
                        <th className="text-center">{whiteName}</th>
                        <th></th>
                        <th className="text-center">{blackName}</th>
                    </tr>
                </thead>
				<tbody>
					<tr style={{ color: getMoveColor("brilliant") }}>
						<td>Brilliant</td>
						<td className="text-center">{stats.white.brilliant}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/brilliant.png`}
								alt="Brilliant Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.brilliant}</td>
					</tr>
					<tr style={{ color: getMoveColor("great") }}>
						<td>Great</td>
						<td className="text-center">{stats.white.great}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/great.png`}
								alt="Great Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.great}</td>
					</tr>
					<tr style={{ color: getMoveColor("best") }}>
						<td>Best</td>
						<td className="text-center">{stats.white.best}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/best.png`}
								alt="Best Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.best}</td>
					</tr>
					<tr style={{ color: getMoveColor("excellent") }}>
						<td>Excellent</td>
						<td className="text-center">{stats.white.excellent}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/excellent.png`}
								alt="Excellent Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.excellent}</td>
					</tr>
					<tr style={{ color: getMoveColor("good") }}>
						<td>Good</td>
						<td className="text-center">{stats.white.good}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/good.png`}
								alt="Good Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.good}</td>
					</tr>
					<tr style={{ color: getMoveColor("an inaccuracy") }}>
						<td>Inaccuracy</td>
						<td className="text-center">{stats.white.inaccuracy}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/inaccuracy.png`}
								alt="Inaccuracy Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.inaccuracy}</td>
					</tr>
					<tr style={{ color: getMoveColor("a mistake") }}>
						<td>Mistake</td>
						<td className="text-center">{stats.white.mistake}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/mistake.png`}
								alt="Mistake Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.mistake}</td>
					</tr>
					<tr style={{ color: getMoveColor("a blunder") }}>
						<td>Blunder</td>
						<td className="text-center">{stats.white.blunder}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/blunder.png`}
								alt="Blunder Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.blunder}</td>
					</tr>
					<tr style={{ color: getMoveColor("a miss") }}>
						<td>Miss</td>
						<td className="text-center">{stats.white.miss}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/miss.png`}
								alt="Miss Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.miss}</td>
					</tr>
					<tr style={{ color: getMoveColor("theory") }}>
						<td>Theory</td>
						<td className="text-center">{stats.white.theory}</td>
						<td>
							<img
								src={`${import.meta.env.BASE_URL}ChessIcons/theory.png`}
								alt="Theory Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td className="text-center">{stats.black.theory}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
export default ClassificationContainer;
