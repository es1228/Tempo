import { useEffect, useState } from "react";
import type { Themes } from "../types/Themes";

const useTheme = () => {
	const [theme, setTheme] = useState<Themes>(() => {
		const savedTheme = localStorage.getItem("theme");

		if (savedTheme) return savedTheme as Themes;

		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		return prefersDark ? "dark" : "light";
	});

	useEffect(() => {
		const root = document.documentElement;
		const isDark = theme === "dark";

		root.classList.toggle("dark", isDark);
		root.classList.toggle("light", !isDark);

		if (theme === "system")
			if (window.matchMedia("(prefers-color-scheme: dark)").matches)
				root.classList.add("dark");
			else root.classList.add("light");

		localStorage.setItem("theme", theme);
	}, [theme]);

	return { theme, setTheme };
};
export default useTheme;
