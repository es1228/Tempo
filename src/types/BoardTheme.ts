export type BoardTheme = {
	lightSquareColor: string;
	darkSquareColor: string;
};

export type BoardColorContextType = {
	boardTheme: BoardTheme;
	setBoardTheme: (theme: BoardTheme) => void;
};
