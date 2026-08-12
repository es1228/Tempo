import { getMoveColor } from "../utils/getMoveColor";
import type { Stats } from "../utils/runGameReview";

type ClassificationContainerProps = {
	stats: Stats;
};

const ClassificationContainer = ({ stats }: ClassificationContainerProps) => {
	if (!stats) return;
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary w-full space-y-2 rounded-3xl p-4">
			<h1>Classifications</h1>
			<hr className="my-2 rounded" />
			<table className="w-full border-separate border-spacing-x-4 text-sm">
				<tbody>
					<tr style={{ color: getMoveColor("brilliant") }}>
						<td>Brilliant</td>
						<td>{stats.white.brilliant}</td>
						<td>
							<img
								src="/ChessIcons/brilliant.png"
								alt="Brilliant Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.brilliant}</td>
					</tr>
					<tr style={{ color: getMoveColor("great") }}>
						<td>Great</td>
						<td>{stats.white.great}</td>
						<td>
							<img
								src="/ChessIcons/great.png"
								alt="Great Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.great}</td>
					</tr>
					<tr style={{ color: getMoveColor("best") }}>
						<td>Best</td>
						<td>{stats.white.best}</td>
						<td>
							<img
								src="/ChessIcons/best.png"
								alt="Best Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.best}</td>
					</tr>
					<tr style={{ color: getMoveColor("excellent") }}>
						<td>Excellent</td>
						<td>{stats.white.excellent}</td>
						<td>
							<img
								src="/ChessIcons/excellent.png"
								alt="Excellent Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.excellent}</td>
					</tr>
					<tr style={{ color: getMoveColor("good") }}>
						<td>Good</td>
						<td>{stats.white.good}</td>
						<td>
							<img
								src="/ChessIcons/good.png"
								alt="Good Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.good}</td>
					</tr>
					<tr style={{ color: getMoveColor("an inaccuracy") }}>
						<td>Inaccuracy</td>
						<td>{stats.white.inaccuracy}</td>
						<td>
							<img
								src="/ChessIcons/inaccuracy.png"
								alt="Inaccuracy Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.inaccuracy}</td>
					</tr>
					<tr style={{ color: getMoveColor("a mistake") }}>
						<td>Mistake</td>
						<td>{stats.white.mistake}</td>
						<td>
							<img
								src="/ChessIcons/mistake.png"
								alt="Mistake Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.mistake}</td>
					</tr>
					<tr style={{ color: getMoveColor("a blunder") }}>
						<td>Blunder</td>
						<td>{stats.white.blunder}</td>
						<td>
							<img
								src="/ChessIcons/blunder.png"
								alt="Blunder Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.blunder}</td>
					</tr>
					<tr style={{ color: getMoveColor("a miss") }}>
						<td>Miss</td>
						<td>{stats.white.miss}</td>
						<td>
							<img
								src="/ChessIcons/miss.png"
								alt="Miss Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.miss}</td>
					</tr>
					<tr style={{ color: getMoveColor("theory") }}>
						<td>Theory</td>
						<td>{stats.white.theory}</td>
						<td>
							<img
								src="/ChessIcons/theory.png"
								alt="Theory Move Icon"
								className="mx-auto h-8 w-8"
							/>
						</td>
						<td>{stats.black.theory}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
export default ClassificationContainer;
