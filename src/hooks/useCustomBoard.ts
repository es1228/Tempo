import { type Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import { useEffect, useRef, useState } from "react";
import {
	defaultPieces,
	type ChessboardOptions,
	type PieceDropHandlerArgs,
} from "react-chessboard";
import { useBoardColors } from "../globalContext";

const useCustomBoard = (chess: Chess) => {
	// data
	const chessGameRef = useRef(chess);
	const chessGame = chessGameRef.current;
	
	const [chessPosition, setChessPosition] = useState(chess.fen());
	const [squareWidth, setSquareWidth] = useState<number | null>(null);

	useEffect(() => {
		const square = document
			.querySelector(`[data-column="a"][data-row="1"]`)
			?.getBoundingClientRect();
		setSquareWidth(square?.width || 50);
	}, []);

	const { boardTheme } = useBoardColors();

	// piece dropping logic
	const onPieceDrop = ({
		sourceSquare,
		targetSquare,
		piece,
	}: PieceDropHandlerArgs) => {
		// specify piece + color
		const color = piece.pieceType[0];
		const type = piece.pieceType[1].toLowerCase();

		// remove on outside drop
		if (!targetSquare) {
			chessGame.remove(sourceSquare as Square);
			setChessPosition(chessGame.fen());

			return true;
		}

		// remove non spare pieces
		if (!piece.isSparePiece) chessGame.remove(sourceSquare as Square);

		// check if move is valid
		const success = chessGame.put(
			{
				color: color as Color,
				type: type as PieceSymbol,
			},
			targetSquare as Square,
		);

		if (!success) return false;

		setChessPosition(chessGame.fen());
		return true;
	};

	// get the spare piece types
	const whitePieceTypes: string[] = [];
	const blackPieceTypes: string[] = [];
	for (const pieceType of Object.keys(defaultPieces)) {
		if (pieceType[0] === "b") blackPieceTypes.push(pieceType as string);
		else whitePieceTypes.push(pieceType as string);
	}

	// options
	const chessboardOptions: ChessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		darkSquareStyle: { backgroundColor: boardTheme.darkSquareColor },
		lightSquareStyle: { backgroundColor: boardTheme.lightSquareColor },
		id: "custom-setup",
	};

	return {
		chessGame,
		chessboardOptions,
		whitePieceTypes,
		blackPieceTypes,
		squareWidth,
		setChessPosition
	};
};
export default useCustomBoard;
