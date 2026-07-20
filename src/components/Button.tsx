type ButtonProps = {
	onClick: () => void;
	icon: string;
	text: string;
};

const Button = ({ text, icon, onClick }: ButtonProps) => {
	return (
		<button
			className="group flex flex-row gap-2 rounded-3xl bg-blue-500/20 p-3 text-nowrap backdrop-blur hover:cursor-pointer"
			onClick={onClick}
		>
			<span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				{icon}
			</span>
			<p className="text-black dark:text-white group-hover:underline">{text}</p>
		</button>
	);
};
export default Button;
