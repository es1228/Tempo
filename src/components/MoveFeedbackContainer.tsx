import { getMoveColor } from "../utils/getMoveColor";

type MoveFeedbackProps = {
    feedback: string;
    best: string;
    opening: string;
}

const MoveFeedbackContainer = ({feedback, best, opening}: MoveFeedbackProps) => {
    const moveClass = feedback.split(" ").at(-1) ?? "Loading";

    return (
        <div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-4">
            <div className="flex flex-row items-center gap-1">
                <img src={`/ChessIcons/${moveClass}.png`} alt={feedback} className="w-8 h-8"/>
                <h1 className={`${getMoveColor(moveClass)}`}>{feedback}</h1>
            </div>
            <h1 className="text-sm text-green-400">{best}</h1>
            <hr className="rounded my-2"/>
            <h1 className="text-center text-sm text-wrap lg:w-60">{opening}</h1>
        </div>
    )
}
export default MoveFeedbackContainer;