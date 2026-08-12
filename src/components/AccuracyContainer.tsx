import type { Stats } from "../utils/runGameReview";

type AccuracyContainerProps = {
	stats: Stats;
};

const AccuracyContainer = ({ stats }: AccuracyContainerProps) => {
	if (!stats) return;
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary w-full space-y-2 rounded-3xl p-4">
			<h1>Accuracies</h1>
			<hr className="my-2 rounded" />
			<div className="flex items-center justify-between gap-4">
				<p className="w-1/2 rounded-3xl bg-white p-2 text-center text-xl text-black">
					{stats.white.accuracy.toFixed(1)}%
				</p>
				<p className="w-1/2 rounded-3xl bg-black p-2 text-center text-xl text-white">
					{stats.black.accuracy.toFixed(1)}%
				</p>
			</div>
		</div>
	);
};
export default AccuracyContainer;
