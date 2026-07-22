import HeaderItem from "./HeaderItem";

const Header = () => {
	return (
		<div className="bg-on-bg/70 dark:bg-on-bg-dark/70 fixed top-0 right-0 left-0 z-100000 flex p-4 backdrop-blur-2xl">
			<div className="ml-2 flex items-center gap-2">
				<span className="icon icon-rounded">chess</span>
				<h1 className="text-lg font-bold">Tempo</h1>
			</div>
			<nav className="ml-auto">
				<ul className="flex gap-4">
					<HeaderItem
						onClick={() =>
							open("https://github.com/es1228/Tempo")
						}
						icon="folder_code"
						text="Repo"
					/>
					<HeaderItem
						onClick={() =>
							open(
								"https://raw.githubusercontent.com/es1228/Tempo/main/README.md",
							)
						}
						icon="book"
						text="README"
					/>
				</ul>
			</nav>
		</div>
	);
};
export default Header;