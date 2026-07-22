type MoveFeedbackProps = {
    feedback: string;
    best: string;
    opening: string;
}

const MoveFeedbackContainer = ({feedback, best, opening}: MoveFeedbackProps) => {
    return (
        <div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-4">
            <h1>{feedback}</h1>
            <h1 className="text-sm text-green-400">{best}</h1>
            <hr className="rounded my-2"/>
            <h1 className="text-center text-sm text-wrap lg:w-60">{opening}</h1>
        </div>
    )
}
export default MoveFeedbackContainer;