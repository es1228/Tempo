import useStockfish from "./hooks/useStockfish";

const App = () => {
	const { bestMove } = useStockfish({
		fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	});
  console.log(`The Best Move is: ${bestMove}`);
	return <></>;
};
export default App;
