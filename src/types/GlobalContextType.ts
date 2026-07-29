import type { BoardTheme } from "./BoardTheme";

export type GlobalContextType = {
	boardTheme: BoardTheme;
	setBoardTheme: (theme: BoardTheme) => void;
    customFen: string | null;
    setCustomFen: (fen: string) => void;
};