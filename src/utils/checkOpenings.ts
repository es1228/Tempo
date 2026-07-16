import {
    findOpening,
	getPositionBook,
	openingBook,
} from "@chess-openings/eco.json";

// cache openings
let cachedOpenings: any;
let cachedPosBook: any;

const initOpenings = async () => {
    if (!cachedOpenings || !cachedPosBook) {
        cachedOpenings = await openingBook();
        cachedPosBook = getPositionBook(cachedOpenings);
    }
    return {openings: cachedOpenings, posBook: cachedPosBook}
}

export const checkOpenings = async (fen: string) => {
	// load openings
	const {openings, posBook} = await initOpenings()

	// get the result
	const result = findOpening(openings, fen, posBook);
	return result?.name;
};
