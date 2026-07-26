type PlayerContainerProps = {
    name: string;
    elo: string;
}

const PlayerContainer = ({name, elo}: PlayerContainerProps) => {
    return (
        <div className="bg-on-bg dark:bg-on-bg-dark w-fit p-4 rounded-lg my-2 flex flex-row items-center gap-2">
            <p>{name}</p>
            <p className="text-text-secondary">{elo && `(${elo})`}</p>
        </div>
    )
}
export default PlayerContainer;