import type { Color } from "chess.js";
import { useCallback, useEffect, useRef, useState } from "react";

const useChessTimer = (
	initialTime: number,
	bonusTime: number,
	activePlayer: Color,
    isActive: boolean,
) => {
	// data
	const [whiteTimeRemaining, setWhiteTimeRemaining] =
		useState<number>(initialTime);
	const [blackTimeRemaining, setBlackTimeRemaining] =
		useState<number>(initialTime);

    // keep the active player updated
	const activePlayerRef = useRef<Color>("w");
	useEffect(() => {
		activePlayerRef.current = activePlayer;
	}, [activePlayer]);

	// reset
	useEffect(() => {
		setWhiteTimeRemaining(initialTime);
		setBlackTimeRemaining(initialTime);
	}, [initialTime]);

	useEffect(() => {
		if (initialTime === Infinity || !isActive) return;

		// decrement based on whos active
		const timer = setInterval(() => {
			if (activePlayerRef.current === "w")
				setWhiteTimeRemaining((prev) => {
					if (prev <= 1) return 0;
					return prev - 1;
				});
			else
				setBlackTimeRemaining((prev) => {
					if (prev <= 1) return 0;
					return prev - 1;
				});
		}, 1000);
		return () => clearInterval(timer);
	}, [initialTime, isActive]);

	// bonus time
	const handleMoveMade = useCallback(
		(playerWhoMoved: Color) => {
			if (initialTime === Infinity || !isActive) return;

			if (playerWhoMoved === "w")
				setWhiteTimeRemaining((prev) => prev + bonusTime);
			else setBlackTimeRemaining((prev) => prev + bonusTime);
		},
		[initialTime, bonusTime, isActive],
	);

    // reset clocks
    const resetClocks = useCallback(() => {
        setWhiteTimeRemaining(initialTime);
        setBlackTimeRemaining(initialTime);
    }, [initialTime])

	return { whiteTimeRemaining, blackTimeRemaining, handleMoveMade, resetClocks };
};
export default useChessTimer;
