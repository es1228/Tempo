import { useEffect, useRef, useState, type MouseEvent } from "react";

type DropdownProps = {
	selectedValue: string;
	handleChange: (e: MouseEvent<HTMLLIElement>) => void;
	values: string[];
	displayValues: string[];
};

const Dropdown = ({
	selectedValue,
	handleChange,
	values,
	displayValues,
}: DropdownProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// auto close if outside click
	const clickRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isMenuOpen) return;

		const handleOutsideClick = (e: Event) => {
			if (
				clickRef.current &&
				!clickRef.current.contains(e.target as Node)
			)
				setIsMenuOpen(false);
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () =>
			document.removeEventListener("mousedown", handleOutsideClick);
	}, [isMenuOpen]);

	return (
		<div className="relative" ref={clickRef}>
			<button
				className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary flex w-full min-w-20 justify-between rounded-3xl p-4 outline-0 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70"
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				{displayValues[values.indexOf(selectedValue)]}
				<div
					className={`block max-h-6 origin-center transition-transform duration-300 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}
				>
					<span className="material-symbols-rounded">
						arrow_drop_down
					</span>
				</div>
			</button>
			<ul
				className={`bg-on-bg-secondary dark:bg-on-bg-dark-secondary absolute top-full left-1/2 z-1000000 mt-2 w-full -translate-x-1/2 rounded-3xl p-2 transition-all duration-300 ease-in-out ${isMenuOpen ? "pointer-events-auto visible scale-100 transform opacity-100" : "pointer-events-none invisible scale-95 transform opacity-0"} `}
				onClick={() => setIsMenuOpen(false)}
			>
				{values.map((val) => (
					<li
						key={val}
						className="flex gap-4 p-2 transition-opacity duration-300 ease-in-out hover:cursor-pointer hover:opacity-70"
						data-value={val}
						onClick={handleChange}
					>
						<div className="w-4">
							{val === selectedValue && (
								<span className="material-symbols-rounded">
									check
								</span>
							)}
						</div>
						{displayValues[values.indexOf(val)]}
					</li>
				))}
			</ul>
		</div>
	);
};
export default Dropdown;
