type GameReviewLoadingDialogProps = {
    isOpen: boolean;
}

const GameReviewLoadingDialog = ({isOpen}: GameReviewLoadingDialogProps) => {
    if (!isOpen) return null;
	return (
		<div className="fixed inset-0 z-100000 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2">
			<div className="bg-on-bg dark:bg-on-bg-dark rounded-3xl mx-auto my-auto">
				<div className="flex flex-col items-center justify-center">
					<h1>Game Review In Progress...</h1>
				</div>
			</div>
		</div>
	);
};
export default GameReviewLoadingDialog;
