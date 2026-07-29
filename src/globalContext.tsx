import { createContext, useContext, useState, type ReactNode } from "react";
import type { GlobalContextType } from "./types/GlobalContextType";
import type { BoardTheme } from "./types/BoardTheme";

export const GlobalContext = createContext<GlobalContextType | null>(null);

const GlobalProvider = ({ children }: {children: ReactNode}) => {
	const [boardTheme, setBoardTheme] = useState<BoardTheme>(
        {
            lightSquareColor: "#f0d9b5",
            darkSquareColor: "#b58863"
        }
    );
    const [customFen, setCustomFen] = useState<string | null>(null);

	return (
		<GlobalContext.Provider value={{ boardTheme, setBoardTheme, customFen, setCustomFen }}>
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

export const useCustomFen = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("Custom fen hook failed");
    }
    return context;
}
