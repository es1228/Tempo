import Button from "./Button";

type GameResultProps = {
	result: string;
    handleRematch: () => void;
    handleNewGame: () => void;
    handleCopy: () => void;
};

export const GameResult = ({ result, handleRematch, handleNewGame, handleCopy }: GameResultProps) => {
	return (
		<div className="bg-on-bg dark:bg-on-bg-dark absolute top-1/2 left-1/2 z-10000 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center">
			<div className="w-full text-center space-y-4">
				<h1>Game Over</h1>
				<p>{result}</p>
				<div className="flex items-center justify-center gap-2">
                    <Button text="Rematch" isPrimary onClick={handleRematch} />
					<Button text="New Game" isSecondary onClick={handleNewGame} />
                    <Button text="Copy PGN" isSecondary onClick={handleCopy} />
				</div>
			</div>
		</div>
	);
};
export default GameResult;
