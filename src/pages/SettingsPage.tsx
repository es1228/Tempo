import type { ChangeEvent, MouseEvent } from "react";
import Dropdown from "../components/Dropdown";
import useTheme from "../hooks/useTheme";
import type { Themes } from "../types/Themes";
import Button from "../components/Button";
import { useBoardColors } from "../globalContext";

const SettingsPage = () => {
	const { theme, setTheme } = useTheme();
	const { boardTheme, setBoardTheme } = useBoardColors();

	return (
		<div className="mx-4 mt-25 flex flex-col gap-4 lg:ml-45">
			<h1 className="text-3xl">Settings</h1>
			<div className="bg-on-bg dark:bg-on-bg-dark flex flex-col gap-4 rounded-3xl p-4">
				<p className="text-xl">Theme</p>
				<Dropdown
					selectedValue={theme}
					values={["light", "dark", "system"]}
					displayValues={["Light", "Dark", "System"]}
					handleChange={(e: MouseEvent<HTMLLIElement>) =>
						setTheme(e.currentTarget.dataset.value as Themes)
					}
				/>
			</div>
			<div className="bg-on-bg dark:bg-on-bg-dark flex flex-col rounded-3xl p-4">
				<div className="flex flex-row items-center justify-between">
					<p className="text-xl">Board Colors</p>
					<Button
						onClick={() =>
							setBoardTheme({
								lightSquareColor: "#f0d9b5",
								darkSquareColor: "#b58863",
							})
						}
						text="Reset"
						icon="delete"
						isSecondary
					/>
				</div>
				<div className="mt-2 flex flex-row gap-4">
					<div className="space-y-2">
						<p>Light Squares</p>
						<input
							type="color"
							className="h-20 w-20 dark:scheme-dark"
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setBoardTheme({
									...boardTheme,
									lightSquareColor: e.target.value,
								})
							}
							value={boardTheme.lightSquareColor}
						/>
					</div>
					<div className="space-y-2">
						<p>Dark Squares</p>
						<input
							type="color"
							className="h-20 w-20 dark:scheme-dark"
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setBoardTheme({
									...boardTheme,
									darkSquareColor: e.target.value,
								})
							}
							value={boardTheme.darkSquareColor}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default SettingsPage;
