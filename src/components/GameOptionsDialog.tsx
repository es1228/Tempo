import { useState } from "react";
import Button from "./Button";

type GameOptionsDialogProps = {
	isDialogOpen: boolean;
	startGame: (
		whiteText: string,
		blackText: string,
		time: number | undefined,
		bonusTime: number | undefined,
		autoRotate: boolean,
		useCustomPosition: boolean,
	) => void;
};

const GameOptionsDialog = ({
	isDialogOpen,
	startGame,
}: GameOptionsDialogProps) => {
	const [whiteText, setWhiteText] = useState<string>("");
	const [blackText, setBlackText] = useState<string>("");
	const [time, setTime] = useState<number>();
	const [bonusTime, setBonusTime] = useState<number>();
	const [autoRotate, setAutoRotate] = useState<boolean>(true);
	const [useCustomPosition, setUseCustomPosition] = useState<boolean>(true);

	if (!isDialogOpen) return null;

	return (
		<div className="bg-on-bg dark:bg-on-bg-dark fixed top-1/2 left-1/2 z-10000 h-screen w-screen -translate-x-1/2 -translate-y-1/2 rounded-3xl p-4 lg:h-3/5 lg:w-1/2">
			<div className="mt-20 space-y-6 lg:mt-0">
				<h1 className="text-3xl">Game Options</h1>
				<div className="flex flex-row items-center gap-4">
					<p>White: </p>
					<input
						type="text"
						placeholder="Name (White)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) => setWhiteText(e.target.value)}
						value={whiteText}
					/>
				</div>
				<div className="flex flex-row items-center gap-4">
					<p>Black: </p>
					<input
						type="text"
						placeholder="Name (Black)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) => setBlackText(e.target.value)}
						value={blackText}
					/>
				</div>
				<div className="flex flex-row items-center gap-4">
					<p>Time</p>
					<input
						type="number"
						placeholder="Time (s) (Unlimited)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) => setTime(e.target.valueAsNumber)}
						value={time || ""}
					/>
					<input
						type="number"
						placeholder="Bonus (+0)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) => setBonusTime(e.target.valueAsNumber)}
						value={bonusTime || ""}
					/>
				</div>
				<div className="flex flex-row items-center gap-4">
					<input
						type="checkbox"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-full"
						onChange={(e) => setAutoRotate(e.target.checked)}
						checked={autoRotate}
					/>
					<p>Rotate</p>
				</div>
				<div className="flex flex-row items-center gap-4">
					<input
						type="checkbox"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-full"
						onChange={(e) => setUseCustomPosition(e.target.checked)}
						checked={useCustomPosition}
					/>
					<p>Use Custom Position</p>
				</div>
				<Button
					text="Start"
					isPrimary
					onClick={() =>
						startGame(
							whiteText,
							blackText,
							time,
							bonusTime,
							autoRotate,
							useCustomPosition
						)
					}
				/>
			</div>
		</div>
	);
};
export default GameOptionsDialog;
