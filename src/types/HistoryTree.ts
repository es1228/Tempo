import type { Move } from "chess.js";

export type MoveNode = {
    id: string;
    fen: string;
    move: Move | null;
    parent: MoveNode | null;
    children: MoveNode[];
}