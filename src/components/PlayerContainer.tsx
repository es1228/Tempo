type PlayerContainerProps = {
    text: string;
}

const PlayerContainer = ({text}: PlayerContainerProps) => {
    return (
        <div className="bg-on-bg dark:bg-on-bg-dark w-fit p-4 rounded-lg my-2">
            <p>{text}</p>
        </div>
    )
}
export default PlayerContainer;