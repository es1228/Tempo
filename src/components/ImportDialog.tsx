import {
	useEffect,
	useRef,
	useState,
	type ChangeEvent,
	type MouseEvent,
} from "react";
import useFetchChessCom from "../hooks/useFetchChessCom";
import Button from "./Button";
import ChessGameItem from "./ChessGameItem";
import Dropdown from "./Dropdown";
import Searchbar from "./SearchBar";

type ImportDialogProps = {
	isDialogOpen: boolean;
	closeDialog: () => void;
};

const ImportDialog = ({ isDialogOpen, closeDialog }: ImportDialogProps) => {
	// data
	const [playerID, setPlayerID] = useState<string>("");
	const [month, setMonth] = useState<number>(0);
	const [selectedValue, setSelectedValue] = useState<string>("Chess.com");
	const [textValue, setTextValue] = useState<string>("");
	const { games, range } = useFetchChessCom({
		playerID: playerID,
		month: month,
	});

	// auto close if outside click
	const clickRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isDialogOpen) return;

		const handleOutsideClick = (e: Event) => {
			if (
				clickRef.current &&
				!clickRef.current.contains(e.target as Node)
			)
				closeDialog();
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () =>
			document.removeEventListener("mousedown", handleOutsideClick);
	}, [isDialogOpen]);

	const values = ["Chess.com", "PGN", "FEN"];

	return (
		<div
			className={`bg-on-bg dark:bg-on-bg-dark fixed top-1/2 left-1/2 z-1000000 h-screen w-screen -translate-x-1/2 -translate-y-1/2 space-y-4 overflow-auto p-8 transition-all duration-300 ease-in-out lg:h-2/3 lg:w-1/2 lg:rounded-3xl ${isDialogOpen ? "pointer-events-auto visible scale-100 transform opacity-100" : "pointer-events-none invisible scale-95 transform opacity-0"} `}
			ref={clickRef}
		>
			<div className="flex flex-row items-center justify-between">
				<h1 className="text-3xl">Import</h1>
				<Button onClick={closeDialog} icon="close" />
			</div>
			<h1 className="text-lg">Source</h1>
			<Dropdown
				selectedValue={selectedValue}
				handleChange={(e: MouseEvent<HTMLLIElement>) => {
					setSelectedValue(
						e.currentTarget.dataset.value ?? "Chess.com",
					);
					setTextValue("");
				}}
				values={values}
			/>
			<div>
				<Searchbar
					placeholder={
						selectedValue === "Chess.com"
							? "Enter Username..."
							: `Enter ${selectedValue}...`
					}
					value={textValue}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setTextValue(e.currentTarget.value)
					}
				/>
			</div>
			<div className="w-full">
				<Button
					onClick={() => {
						selectedValue === "Chess.com" && setPlayerID(textValue);
					}}
					icon="check"
					text="Enter"
					isPrimary
				/>
			</div>
			{selectedValue === "Chess.com" && (
				<>
					<div className="flex flex-row items-center justify-between">
						<Button
							onClick={() => {}}
							icon="search"
							text="Latest"
							isPrimary
						/>
						<p>
							{new Date(
								games?.[0]?.end_time * 1000,
							).toLocaleDateString("en-us", {
								month: "long",
								year: "numeric",
							}) ?? ""}
						</p>
						<div className="flex flex-row">
							<Button
								onClick={() =>
									month < range &&
									setMonth((prev) => prev + 1)
								}
								icon="arrow_back"
							/>
							<Button
								onClick={() =>
									month > 0 && setMonth((prev) => prev - 1)
								}
								icon="arrow_forward"
							/>
						</div>
					</div>
					<ul className="space-y-4">
						{games.map((game) => (
							<ChessGameItem
								key={game.url}
								timeClass={game.time_class}
								white={game.white.username}
								whiteElo={game.white.rating}
								black={game.black.username}
								blackElo={game.black.rating}
								date={new Date(
									game.end_time * 1000,
								).toDateString()}
								result={
									game.white.username.toLowerCase() ===
									playerID.toLowerCase()
										? game.white.result
										: game.black.result
								}
							/>
						))}
					</ul>
				</>
			)}
		</div>
	);
};
export default ImportDialog;
