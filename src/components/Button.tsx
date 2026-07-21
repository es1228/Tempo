type ButtonProps = {
	onClick: () => void;
	icon: string;
	text?: string;
	isPrimary?: boolean;
};

const Button = ({ text, icon, isPrimary, onClick }: ButtonProps) => {
	return (
		<button
			className={`group flex flex-row gap-2 rounded-3xl p-3 text-nowrap backdrop-blur hover:cursor-pointer ${isPrimary ? "bg-primary" : "bg-on-bg dark:bg-on-bg-dark"}`}
			onClick={onClick}
		>
			<span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				{icon}
			</span>
			{text && <p className="group-hover:underline">{text}</p>}
		</button>
	);
};
export default Button;
