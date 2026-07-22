import type { Move } from "chess.js";
import Button from "./Button";

type HistoryContainerProps = {
	history: Move[];
    goToMove: (index: number) => void;
};

const HistoryContainer = ({ history, goToMove }: HistoryContainerProps) => {
	// separate into turns
	const turns = [];
	for (let i = 0; i < history.length; i += 2) {
		turns.push({
			turnNumber: Math.floor(i / 2) + 1,
			white: { move: history[i], index: i },
			black: history[i + 1]
				? { move: history[i + 1], index: i + 1 }
				: null,
		});
	}
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-4 max-h-50 overflow-auto">
            <h1>History</h1>
            <hr className="rounded my-2"/>
			<ol className="list-decimal">
				{turns.map(({turnNumber, white, black}) => (
                    <div key={turnNumber} className="flex flex-row items-center">
                        <p>{turnNumber}.</p>
                        <Button text={white.move.san} onClick={() => goToMove(white.index)}/>
                        {black && (
                            <Button text={black.move.san} onClick={() => goToMove(black.index)}/>
                        )}
                    </div>
				))}
			</ol>
		</div>
	);
};
export default HistoryContainer;
