type PlayerContainerProps = {
    text: string;
}

const TimeContainer = ({text}: PlayerContainerProps) => {
    return (
        <div className="bg-on-bg dark:bg-on-bg-dark w-fit p-4 rounded-lg my-2 flex flex-row items-center gap-2">
            <span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				timer
			</span>
            <p>{text}</p>
        </div>
    )
}
export default TimeContainer;