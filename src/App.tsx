import Navbar from "./components/Navbar";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import useFetchChessCom from "./hooks/useFetchChessCom";
import EvalPage from "./pages/ReviewPage";

const App = () => {

	const { theme } = useTheme();
	console.log(theme);

	const {games} = useFetchChessCom({
		playerID: "GothamChess",
		month: 0,
	}
	);
	console.log(games);

	return (
		<>
			<Header />
			<Navbar onClick={() => {}} page="Review" />
			<EvalPage />
		</>
	);
};
export default App;
