import Button from "./Button";
import type { Stats } from "../utils/runGameReview";
import { getMoveColor } from "../utils/getMoveColor";
import type { MoveNode } from "../types/HistoryTree";
import { getMainlineNodes } from "../utils/getMainlineNodes";

type HistoryContainerProps = {
	stats: Stats;
	rootNode: MoveNode;
	currentNode: MoveNode;
	goToNode: (node: MoveNode) => void;
};

type BranchRendererProps = {
	node: MoveNode;
	currentNode: MoveNode;
	goToNode: (node: MoveNode) => void;
	stats?: Stats;
};

const BranchRenderer = ({
	node,
	currentNode,
	goToNode,
	stats,
}: BranchRendererProps) => {
	const move = node.move;
	if (!move) return null;

	const variationChildren = node.children.slice(1);

	const review = stats?.reviewedMoves?.find((m) => m.before === move.before && m.after === move.after);
	const moveClass = review?.classification ?? "";
	const shortClass = moveClass.split(" ").at(-1);

	return (
		<div className="flex items-center gap-2">
			{stats && review && shortClass && (
				<img
					src={`${import.meta.env.BASE_URL}ChessIcons/${shortClass}.png`}
					alt={shortClass}
					className="h-6 w-6"
				/>
			)}
			<Button
				text={move.san}
				textColor={getMoveColor(moveClass)}
				onClick={() => goToNode(node)}
				isOnBg={currentNode?.id === node?.id}
			/>
			{variationChildren.map((varNode) => {
				const subNodes = [varNode, ...getMainlineNodes(varNode)];

				const subTurns = [];
				for (let i = 0; i < subNodes.length; i += 2) {
					subTurns.push({
						turnNumber: Math.floor(i / 2) + 1,
						white: subNodes[i],
						black: subNodes[i + 1] ?? null,
					});
				}

				return (
					<div key={varNode.id} className="text-text-secondary flex items-center">
						<p>(</p>
						{subNodes.map((subNode) => (
							<div>
								<BranchRenderer
									key={subNode.id}
									node={subNode}
									currentNode={currentNode}
									goToNode={goToNode}
									stats={stats}
								/>
							</div>
						))}
						<p>)</p>
					</div>
				);
			})}
		</div>
	);
};

const HistoryContainer = ({
	stats,
	rootNode,
	currentNode,
	goToNode,
}: HistoryContainerProps) => {
	// separate into turns
	const mainlineNodes = getMainlineNodes(rootNode);

	const turns = [];
	for (let i = 0; i < mainlineNodes.length; i += 2) {
		turns.push({
			turnNumber: Math.floor(i / 2) + 1,
			white: mainlineNodes[i],
			black: mainlineNodes[i + 1] ?? null,
		});
	}

	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-4 max-w-80">
			<h1>History</h1>
			<hr className="my-2 rounded" />
			{turns.map((turn) => (
				<div key={turn.white.id} className="flex items-center gap-2 max-w-fit overflow-auto">
					<p>{turn.turnNumber}.</p>
					{turn.white && (
						<BranchRenderer
							node={turn.white}
							currentNode={currentNode}
							goToNode={goToNode}
							stats={stats}
						/>
					)}
					{turn.black && (
						<BranchRenderer
							node={turn.black}
							currentNode={currentNode}
							goToNode={goToNode}
							stats={stats}
						/>
					)}
				</div>
			))}
		</div>
	);
};
export default HistoryContainer;
