import type { PieceSymbol } from "chess.js";
import Button from "./Button";

type PromotionDialogProps = {
	isDialogOpen: boolean;
	onSelect: (p: PieceSymbol) => void;
};

export const PromotionDialog = ({
	isDialogOpen,
	onSelect,
}: PromotionDialogProps) => {
	return (
		isDialogOpen && (
			<div className="bg-on-bg dark:bg-on-bg-dark absolute top-1/2 left-1/2 z-10000 h-1/4 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl flex items-center">
				<div className="flex flex-row w-full justify-center scale-125">
					<Button icon="chess_queen" onClick={() => onSelect("q")} />
					<Button icon="chess_rook" onClick={() => onSelect("r")} />
					<Button icon="chess_bishop" onClick={() => onSelect("b")} />
					<Button icon="chess_knight" onClick={() => onSelect("n")} />
				</div>
			</div>
		)
	);
};
export default PromotionDialog;
