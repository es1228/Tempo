import { useEffect, useState } from "react";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { type Color } from "chess.js";
import TextInput from "./TextInput";
import Checkbox from "./Checkbox";

type GameOptionsDialogProps = {
	isDialogOpen: boolean;
	startGame: (
		whiteText: string,
		blackText: string,
		time: number | undefined,
		bonusTime: number | undefined,
		autoRotate: boolean,
		isUsingCustomPosition: boolean,
		isPlayingAgainstEngine: boolean,
		playerColor: Color,
		engineStrength: number,
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
	const [autoRotate, setAutoRotate] = useState<boolean>(false);
	const [isUsingCustomPosition, setIsUsingCustomPosition] =
		useState<boolean>(false);
	const [isPlayingAgainstEngine, setIsPlayingAgainstEngine] =
		useState<boolean>(false);
	const [playerColor, setPlayerColor] = useState<Color>("w");
	const [engineStrength, setEngineStrength] = useState<number>(20);

	useEffect(() => {
		setWhiteText("");
		setBlackText("");
		if (isPlayingAgainstEngine) {
			playerColor === "w"
				? setBlackText(`Stockfish 18 (LVL ${engineStrength})`)
				: setWhiteText(`Stockfish 18 (LVL ${engineStrength})`);
		}
	}, [isPlayingAgainstEngine, playerColor, engineStrength]);

	if (!isDialogOpen) return null;

	return (
		<div className="bg-on-bg dark:bg-on-bg-dark fixed top-1/2 left-1/2 z-10000 h-screen w-screen -translate-x-1/2 -translate-y-1/2 rounded-3xl p-4 lg:p-6 lg:mt-9 lg:h-2/3 lg:w-1/2">
			<div className="mt-20 space-y-6 lg:mt-0">
				<h1 className="text-3xl">Game Options</h1>
				<TextInput
					label="White: "
					onChange={(e) => setWhiteText(e.target.value)}
					value={whiteText}
				/>
				<TextInput
					label="Black: "
					onChange={(e) => setBlackText(e.target.value)}
					value={blackText}
				/>
				<div className="flex flex-row items-center gap-4">
					<p>Time</p>
					<input
						type="number"
						placeholder="Time (s) (Unlimited)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) =>
							setTime(
								e.target.valueAsNumber > 0
									? e.target.valueAsNumber
									: Infinity,
							)
						}
						value={time || ""}
					/>
					<input
						type="number"
						placeholder="Bonus (+0)"
						className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
						onChange={(e) =>
							setBonusTime(
								e.target.valueAsNumber > 0
									? e.target.valueAsNumber
									: 0,
							)
						}
						value={bonusTime || ""}
					/>
				</div>
				<div className="flex flex-row gap-4">
					<Checkbox
						label="Auto Rotate"
						isChecked={autoRotate}
						onChange={(e) => setAutoRotate(e.target.checked)}
					/>
					<Checkbox
						label="Custom Position"
						isChecked={isUsingCustomPosition}
						onChange={(e) =>
							setIsUsingCustomPosition(e.target.checked)
						}
					/>
					<Checkbox
						label="Play vs. Engine"
						isChecked={isPlayingAgainstEngine}
						onChange={(e) =>
							setIsPlayingAgainstEngine(e.target.checked)
						}
					/>
				</div>
				{isPlayingAgainstEngine && (
					<div className="flex items-center gap-4">
						<div className="flex flex-row items-center gap-4">
							<p>Player Color: </p>
							<Dropdown
								selectedValue={playerColor}
								values={["w", "b"]}
								displayValues={["White", "Black"]}
								handleChange={(e) =>
									setPlayerColor(
										e.currentTarget.dataset.value as Color,
									)
								}
							/>
						</div>
						<div className="flex flex-row items-center gap-4">
							<p>Engine Strength: </p>
							<input
								type="number"
								placeholder="0-20"
								min={0}
								max={20}
								onChange={(e) =>
									setEngineStrength(
										e.target.valueAsNumber >= 0 &&
											e.target.valueAsNumber <= 20
											? e.target.valueAsNumber
											: 20,
									)
								}
								className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
							/>
						</div>
					</div>
				)}
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
							isUsingCustomPosition,
							isPlayingAgainstEngine,
							playerColor,
							engineStrength,
						)
					}
				/>
			</div>
		</div>
	);
};
export default GameOptionsDialog;
