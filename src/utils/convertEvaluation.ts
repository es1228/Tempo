export const convertEvaluation = (evaluation: string) => {
    if (!evaluation) return 0;

	// mate evaluations
	if (evaluation.includes("M")) {
		// extract details
		const side = evaluation[0];
		const sign = side === "+" ? 1 : -1;
		const score = Number(evaluation.substring(2));

		// set the evaluation to a large number
		const evalNum = sign * (200 - score);
        return evalNum;
	}
    return Number(evaluation);
};
