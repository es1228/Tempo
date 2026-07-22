type ChessGameItemProps = {
    timeClass: string;
    white: string;
    whiteElo: number;
    black: string;
    blackElo: number;
    date: string;
    result: string;
    onClick: () => void;
}

const ChessGameItem = ({timeClass, white, whiteElo, black, blackElo, date, result, onClick}: ChessGameItemProps) => {
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary flex flex-row items-center justify-between gap-4 rounded-3xl p-4 overflow-auto hover:cursor-pointer hover:opacity-80" onClick={onClick}>
			<div className="flex flex-row gap-4 items-center">
				<p>{timeClass}</p>
				<div>
                    <div className="flex flex-row items-center gap-2">
                        <span className="inline-block bg-white w-4 h-4 rounded border border-black"></span>
                        <p>{white}</p>
                        <p className="text-text-secondary">
                            {`(${whiteElo})`}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <span className="inline-block bg-black w-4 h-4 rounded border border-white"></span>
                        <p>{black}</p>
                        <p className="text-text-secondary">
                            {`(${blackElo})`}
                        </p>
                    </div>
				</div>
			</div>
			<div className="flex flex-row gap-4">
				<p>{date}</p>
				<p>{result}</p>
			</div>
		</div>
	);
};
export default ChessGameItem;
