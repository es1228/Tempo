type ButtonProps = {
	onClick: () => void;
	icon?: string;
	text?: string;
	isPrimary?: boolean;
	isSecondary?: boolean;
	isOnBg?: boolean;
	textColor?: string;
};

const Button = ({
	text,
	icon,
	isPrimary,
	isSecondary,
	isOnBg,
	textColor,
	onClick,
}: ButtonProps) => {
	return (
		<button
			className={`group flex flex-row gap-2 rounded-3xl p-3 text-nowrap hover:cursor-pointer ${isPrimary && "bg-primary"} ${isSecondary && "bg-on-bg-secondary dark:bg-on-bg-dark-secondary"} ${isOnBg && "bg-on-bg dark:bg-on-bg-dark"}`}
			onClick={onClick}
		>
			{icon && <span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				{icon}
			</span>}
			{text && <p className="group-hover:underline" style={{color: textColor}}>{text}</p>}
		</button>
	);
};
export default Button;
