import { useEffect, useState } from "react";
import {
	type ChessComArchives,
	type ChessComGames,
	type Game,
} from "../types/ChessComAPIResponse";

type useFetchChessComProps = {
	playerID: string;
	month: number;
};

const useFetchChessCom = ({ playerID, month }: useFetchChessComProps) => {
	// data
	const [games, setGames] = useState<Game[]>([]);
	const [range, setRange] = useState<number>(0);

	useEffect(() => {
		if (!playerID) return;

		const fetchData = async () => {
			try {
				// fetch game days
				const response = await fetch(
					`https://api.chess.com/pub/player/${playerID}/games/archives`,
					{
						headers: {
							"User-Agent":
								"Tempo/1.0 (contact: evanssidhu@gmail.com)",
						},
					},
				);
				const json: ChessComArchives = await response.json();

				// fetch actual games
				if (!json?.archives || json.archives.length === 0) return;

				const results = await fetch(json.archives[json.archives.length - 1 - month], {
					headers: {
						"User-Agent":
							"Tempo/1.0 (contact: evanssidhu@gmail.com)",
					},
				});

				setRange(json.archives.length - 1);
				const data: ChessComGames = await results.json();
				setGames(data.games.toReversed());
			} catch {
				console.error("Could not fetch chess.com archives");
			}
		};
		fetchData();
	}, [playerID, month]);
	return { games, range };
};
export default useFetchChessCom;
