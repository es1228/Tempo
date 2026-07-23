import type { Pages } from "../types/Pages";

type NavbarItemProps = {
	icon: string;
	text: string;
	onClick: (page: Pages) => void;
	page: Pages;
};

const NavbarItem = ({ icon, text, onClick, page }: NavbarItemProps) => {
	return (
		<li
			className="group hover:bg-primary/20 hover:cursor-pointer flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-100 md:flex-row"
			style={{backgroundColor: page === text ? "var(--color-primary)" : ""}}
			onClick={() => onClick(text as Pages)}
		>
			<span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
				{icon}
			</span>
			<p className="text-xs text-nowrap group-hover:underline md:text-lg">
				{text}
			</p>
		</li>
	);
};
export default NavbarItem;