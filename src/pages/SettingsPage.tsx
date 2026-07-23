import type { MouseEvent } from "react";
import Dropdown from "../components/Dropdown";
import useTheme from "../hooks/useTheme";
import type { Themes } from "../types/Themes";

const SettingsPage = () => {
	const { theme, setTheme } = useTheme();

	return (
		<div className="mx-4 mt-25 flex flex-col gap-4 lg:ml-45">
			<h1 className="text-3xl">Settings</h1>
			<div className="bg-on-bg dark:bg-on-bg-dark flex flex-col gap-2 rounded-3xl p-4">
				<p>Theme</p>
				<Dropdown
					selectedValue={theme}
					values={["light", "dark", "system"]}
					displayValues={["Light", "Dark", "System"]}
					handleChange={(e: MouseEvent<HTMLLIElement>) => setTheme(e.currentTarget.dataset.value as Themes)}
				/>
			</div>
		</div>
	);
};
export default SettingsPage;
