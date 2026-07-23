import Navbar from "./components/Navbar";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import ReviewPage from "./pages/ReviewPage";
import { useState } from "react";
import { type Pages } from "./types/Pages";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
	const { theme } = useTheme();
	console.log(theme);

	const [page, setPage] = useState<Pages>("Review");

	return (
		<>
			<Header />
			<Navbar onClick={(p: Pages) => setPage(p)} page={page} />
			{page === "Review" && <ReviewPage />}
			{page === "Settings" && <SettingsPage />}
		</>
	);
};
export default App;
