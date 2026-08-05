type PlayerContainerProps = {
    text: string;
}

const TimeContainer = ({text}: PlayerContainerProps) => {
    const formatSeconds = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const mm = String(minutes).padStart(2, "0");
        const ss = String(seconds).padStart(2, "0");

        return `${mm}:${ss}`
    }

    return (
        <div className="bg-on-bg dark:bg-on-bg-dark w-fit p-4 rounded-lg my-2 flex flex-row items-center gap-2">
            <span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				timer
			</span>
            <p>{formatSeconds(Number(text))}</p>
        </div>
    )
}
export default TimeContainer;