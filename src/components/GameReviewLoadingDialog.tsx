type GameReviewLoadingDialogProps = {
	isOpen: boolean;
};

const GameReviewLoadingDialog = ({ isOpen }: GameReviewLoadingDialogProps) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 top-1/2 left-1/2 z-100000 h-full w-full -translate-x-1/2 -translate-y-1/2 p-2">
			<div className="bg-on-bg/20 dark:bg-on-bg-dark/40 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/4 w-1/4 rounded-3xl backdrop-blur-3xl text-center p-4 space-y-8">
				<h1 className="text-3xl">Game Review Loading...</h1>
				<p>This usually takes under 15 seconds, depending on how many moves were played in the game.</p>
			</div>
		</div>
	);
};
export default GameReviewLoadingDialog;