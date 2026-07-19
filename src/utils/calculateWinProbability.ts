export const calculateWinProbability = (evaluation: string) => {
    // win probability function
    const winProbability = (evaluation: number) =>
		1 / (1 + Math.pow(Math.E, -0.4 * evaluation));

    let evalNum;

    // set checkmate to infinity
    if (evaluation.includes("M")) {
        // check who has mate
        const sign = evaluation.includes("+") ? 1 : -1;

        // format the evaluation as number
        evalNum = sign * Infinity;
    }
    else {
        evalNum = Number(evaluation);
    }

    // calculate win probability
    return winProbability(evalNum);
}