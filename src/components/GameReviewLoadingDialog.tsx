type GameReviewLoadingDialogProps = {
	isOpen: boolean;
};

const GameReviewLoadingDialog = ({ isOpen }: GameReviewLoadingDialogProps) => {
	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 top-1/2 left-1/2 z-100000 h-full w-full -translate-x-1/2 -translate-y-1/2 p-2">
			<div className="bg-on-bg/20 dark:bg-on-bg-dark/40 mx-auto my-auto rounded-3xl backdrop-blur-3xl">
				<div className="flex flex-col items-center justify-center">
					<h1>Game Review In Progress...</h1>
				</div>
			</div>
		</div>
	);
};
export default GameReviewLoadingDialog;
