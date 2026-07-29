import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ReviewPage from "./pages/ReviewPage";
import { useState } from "react";
import { type Pages } from "./types/Pages";
import SettingsPage from "./pages/SettingsPage";
import useTheme from "./hooks/useTheme";
import GlobalProvider from "./globalContext";
import GamePage from "./pages/GamePage";

const App = () => {
	const [page, setPage] = useState<Pages>("Play");
	useTheme();

	return (
		<GlobalProvider>
			<Header />
			<Navbar onClick={(p: Pages) => setPage(p)} page={page} />
			{page === "Review" && <ReviewPage />}
			{page === "Settings" && <SettingsPage />}
			{page === "Play" && <GamePage />}
		</GlobalProvider>
	);
};
export default App;
