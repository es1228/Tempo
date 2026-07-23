import { createContext, useContext, useState, type ReactNode } from "react";
import type { BoardColorContextType, BoardTheme } from "./types/BoardTheme";

export const GlobalContext = createContext<BoardColorContextType | null>(null);

const GlobalProvider = ({ children }: {children: ReactNode}) => {
	const [boardTheme, setBoardTheme] = useState<BoardTheme>(
        {
            lightSquareColor: "#f0d9b5",
            darkSquareColor: "#b58863"
        }
    );

	return (
		<GlobalContext.Provider value={{ boardTheme, setBoardTheme }}>
			{children}
		</GlobalContext.Provider>
	);
};
export default GlobalProvider;

export const useBoardColors = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("Board colors hook failed");
    }
    return context;
}
