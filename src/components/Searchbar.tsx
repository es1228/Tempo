import type { ChangeEvent } from "react";

type SearchbarProps = {
    placeholder: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	value: string;
}

const Searchbar = ({placeholder, value, onChange}: SearchbarProps) => {
	return (
		<>
			<div className="relative">
				<div className="absolute z-1000 m-3">
					<span className="icon icon-rounded group-hover:icon-filled group-hover:icon-700 transition-all duration-100">
						search
					</span>
				</div>
				<input
					type="text"
					placeholder={placeholder}
					onChange={onChange}
					value={value}
					className="group bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-3 pl-11 outline-0 min-w-full"
					autoComplete="off"
				/>
			</div>
		</>
	);
}
export default Searchbar;
