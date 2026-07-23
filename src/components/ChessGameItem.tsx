import { formatResult } from "../utils/formatResult";

type ChessGameItemProps = {
	timeClass: string;
	white: string;
	whiteElo: number;
	black: string;
	blackElo: number;
	date: string;
	result: string;
	onClick: () => void;
};

const ChessGameItem = ({
	timeClass,
	white,
	whiteElo,
	black,
	blackElo,
	date,
	result,
	onClick,
}: ChessGameItemProps) => {
	const resultStatus = formatResult(result);
	const resultColor =
		resultStatus === "W" ? "text-green-500" : resultStatus === "L" ? "text-red-500" : "text-text-secondary";

	return (
		<div
			className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary flex flex-row items-center justify-between gap-4 overflow-auto rounded-3xl p-4 hover:cursor-pointer hover:opacity-80"
			onClick={onClick}
		>
			<div className="flex flex-row items-center gap-4 overflow-auto">
				<img src={`/ChessIcons/${timeClass}.png`} alt={timeClass} className="h-10 w-10"/>
				<div>
					<div className="flex flex-row items-center gap-2">
						<span className="inline-block h-4 w-4 rounded border border-black bg-white"></span>
						<p>{white}</p>
						<p className="text-text-secondary">{`(${whiteElo})`}</p>
					</div>
					<div className="flex flex-row items-center gap-2">
						<span className="inline-block h-4 w-4 rounded border border-white bg-black"></span>
						<p>{black}</p>
						<p className="text-text-secondary">{`(${blackElo})`}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-row items-center gap-4">
				<p className="hidden lg:block">{date}</p>
				<p className={`font-bold text-lg ${resultColor}`}>
					{resultStatus}
				</p>
			</div>
		</div>
	);
};
export default ChessGameItem;
