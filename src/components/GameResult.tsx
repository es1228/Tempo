import { useState } from "react";
import Button from "./Button";

type GameResultProps = {
	result: string;
    handleRematch: () => void;
    handleNewGame: () => void;
    handleCopy: () => void;
	isDialogOpen: boolean;
};

export const GameResult = ({ result, handleRematch, handleNewGame, handleCopy, isDialogOpen }: GameResultProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(isDialogOpen);

	if (!isOpen) return;

	return (
		<div className="bg-on-bg dark:bg-on-bg-dark absolute top-1/2 left-1/2 z-10000 flex h-3/5 w-2/3 rounded-3xl -translate-x-1/2 -translate-y-1/2 items-center">
			<div className="w-full h-full text-center flex flex-col justify-between">
				<div className="flex justify-between items-center mx-4 mt-4">
					<Button icon="arrow_back" onClick={handleNewGame}/>
					<h1 className="text-lg">Game Over</h1>
					<Button icon="close" onClick={() => setIsOpen(false)}/>
				</div>
				<p>{result}</p>
				<div className="flex items-center justify-center gap-2 mb-4">
                    <Button icon="autorenew" text="Rematch" isPrimary onClick={handleRematch} />
                    <Button icon="content_copy" text="PGN" isSecondary onClick={handleCopy} />
				</div>
			</div>
		</div>
	);
};
export default GameResult;
