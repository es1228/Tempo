import type { MoveNode } from "../types/HistoryTree";

export const getMainlineNodes = (root: MoveNode): MoveNode[] => {
    const nodes: MoveNode[] = [];
    let curr = root;
    while (curr.children.length > 0) {
        curr = curr.children[0];
        nodes.push(curr);
    }
    return nodes;
}