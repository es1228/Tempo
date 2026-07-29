import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ReviewPage from "./pages/ReviewPage";
import { useState } from "react";
import { type Pages } from "./types/Pages";
import SettingsPage from "./pages/SettingsPage";
import useTheme from "./hooks/useTheme";
import GlobalProvider from "./globalContext";
import GamePage from "./pages/GamePage";
import CustomPage from "./pages/CustomPage";

const App = () => {
	const [page, setPage] = useState<Pages>("Review");
	useTheme();

	return (
		<GlobalProvider>
			<Header />
			<Navbar onClick={(p: Pages) => setPage(p)} page={page} />
			{page === "Review" && <ReviewPage />}
			{page === "Settings" && <SettingsPage />}
			{page === "Play" && <GamePage />}
			{page === "Custom" && <CustomPage />}
		</GlobalProvider>
	);
};
export default App;
