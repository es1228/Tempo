type HeaderItemProps = {
	onClick: () => void;
    icon: string;
    text: string;
};

const HeaderItem = ({ onClick, icon, text }: HeaderItemProps) => {
	return (
		<li
			className="group flex flex-col items-center transition-all duration-100 hover:cursor-pointer"
			onClick={onClick}
		>
			<span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				{icon}
			</span>
			<p className="text-xs group-hover:underline">{text}</p>
		</li>
	);
};
export default HeaderItem;