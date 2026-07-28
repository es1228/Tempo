import type { Color, PieceSymbol, Square } from "chess.js";
import { type CSSProperties, useEffect, useState } from "react";
import { defaultPieces, type PieceRenderObject } from "react-chessboard";

type PromotionDialogProps = {
	isDialogOpen: boolean;
	onSelect: (p: PieceSymbol) => void;
	square: Square;
	moveColor: Color;
};

export const PromotionDialog = ({
	isDialogOpen,
	onSelect,
	square,
	moveColor,
}: PromotionDialogProps) => {
	const [posStyle, setPosStyle] = useState<CSSProperties>({});

	// update on window change
	useEffect(() => {
		if (!square) return;

		const updatePos = () => {
			const pos = document
				.getElementById(`board-square-${square}`)
				?.getBoundingClientRect();

			if (pos) {
				const isRank1 = square.endsWith("1");

				setPosStyle({
					top: `${isRank1 ? pos.y + pos.height : pos.y}px`,
					left: `${pos.x}px`,
					width: `${pos.width}px`,
				});
			}
		};
		updatePos();

		window.addEventListener("scroll", updatePos, true);
		window.addEventListener("resize", updatePos);

		return () => {
			window.removeEventListener("scroll", updatePos, true);
			window.removeEventListener("resize", updatePos);
		};
	}, [square, isDialogOpen]);

	if (!square) return;

	const isRank1 = square.endsWith("1");
	return (
		isDialogOpen && (
			<div
				className={`fixed z-10000 flex bg-white drop-shadow ${isRank1 ? "-translate-y-full flex-col-reverse" : "flex-col"} gap-4`}
				style={posStyle}
			>
				<div
					className={`flex ${isRank1 ? "flex-col-reverse" : "flex-col"}`}
				>
					<button
						className="hover:cursor-pointer hover:opacity-70"
						onClick={() => onSelect("q")}
					>
						{defaultPieces[
							`${moveColor}Q` as keyof PieceRenderObject
						]()}
					</button>
					<button
						className="hover:cursor-pointer hover:opacity-70"
						onClick={() => onSelect("r")}
					>
						{defaultPieces[
							`${moveColor}R` as keyof PieceRenderObject
						]()}
					</button>
					<button
						className="hover:cursor-pointer hover:opacity-70"
						onClick={() => onSelect("b")}
					>
						{defaultPieces[
							`${moveColor}B` as keyof PieceRenderObject
						]()}
					</button>
					<button
						className="hover:cursor-pointer hover:opacity-70"
						onClick={() => onSelect("n")}
					>
						{defaultPieces[
							`${moveColor}N` as keyof PieceRenderObject
						]()}
					</button>
				</div>
			</div>
		)
	);
};
export default PromotionDialog;
