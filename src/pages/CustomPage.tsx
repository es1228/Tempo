import { Chess, type Color } from "chess.js";
import useCustomBoard from "../hooks/useCustomBoard";
import { Chessboard, ChessboardProvider, SparePiece } from "react-chessboard";
import { useBoardColors, useCustomFen } from "../globalContext";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { useState } from "react";
import { checkLegalFen } from "../utils/checkLegalFen";
import ImportDialog from "../components/ImportDialog";
import { checkActivePlayer } from "../utils/checkActivePlayer";

const CustomPage = () => {
	const {
		chessGame,
		chessboardOptions,
		whitePieceTypes,
		blackPieceTypes,
		squareWidth,
		setChessPosition
	} = useCustomBoard(
		new Chess("8/8/8/8/8/8/8/8 w - - 0 1", { skipValidation: true }),
	);
	const { boardTheme } = useBoardColors();

	const { setCustomFen } = useCustomFen();

	const [turnToMove, setTurnToMove] = useState<Color>("w");

	const changeTurn = (turnColor: Color) => {
		try {
			chessGame.setTurn(turnColor);
			setTurnToMove(turnColor);
		} catch {
			console.error("Invalid Position");
		}
	};

	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const handleImport = (data: string) => {
		if (!data) return;
		setChessPosition(data);
		chessGame.load(data, {skipValidation: true});
		changeTurn(checkActivePlayer(data));
		setCustomFen(data);
		setIsDialogOpen(false);
	};

	return (
		<div className="mx-4 mt-22 flex justify-center gap-2">
			<ImportDialog
				values={["FEN"]}
				isDialogOpen={isDialogOpen}
				closeDialog={() => setIsDialogOpen(false)}
				handleImport={handleImport}
			/>
			<div>
				<div className="w-80 md:w-110">
					<ChessboardProvider options={chessboardOptions}>
						{squareWidth ? (
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(6, 1fr)",
									width: "fit-content",
									margin: "0 auto",
								}}
							>
								{blackPieceTypes.map((pieceType, index) => (
									<div
										key={pieceType}
										style={{
											width: `${squareWidth}px`,
											height: `${squareWidth}px`,
											backgroundColor:
												index % 2 === 1
													? boardTheme.darkSquareColor
													: boardTheme.lightSquareColor,
										}}
									>
										<SparePiece pieceType={pieceType} />
									</div>
								))}
							</div>
						) : null}

						<Chessboard />

						{squareWidth ? (
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(6, 1fr)",
									width: "fit-content",
									margin: "0 auto",
								}}
							>
								{whitePieceTypes.map((pieceType, index) => (
									<div
										key={pieceType}
										style={{
											width: `${squareWidth}px`,
											height: `${squareWidth}px`,
											backgroundColor:
												index % 2 === 1
													? boardTheme.lightSquareColor
													: boardTheme.darkSquareColor,
										}}
									>
										<SparePiece pieceType={pieceType} />
									</div>
								))}
							</div>
						) : null}
						<div className="mt-2 flex w-full items-center justify-center gap-2">
							<Button
								text="Save"
								icon="save"
								isPrimary
								onClick={() => {
									if (checkLegalFen(chessGame.fen())) {
										setCustomFen(chessGame.fen());
										alert(
											"Position Saved. Enable Custom Position in Play page to play.",
										);
									}
								}}
							/>
							<Button text="Import" icon="download" isPrimary onClick={() => setIsDialogOpen(true)}/>
							<Dropdown
								selectedValue={turnToMove}
								handleChange={(e) =>
									changeTurn(
										e.currentTarget.dataset.value as Color,
									)
								}
								values={["w", "b"]}
								displayValues={["White's Turn", "Black's Turn"]}
								isPrimary
								isOnTop
							/>
						</div>
					</ChessboardProvider>
				</div>
			</div>
		</div>
	);
};
export default CustomPage;
