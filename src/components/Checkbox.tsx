import type { ChangeEvent } from "react";

type CheckboxProps = {
    label: string;
    isChecked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({label, isChecked, onChange}: CheckboxProps) => {
	return (
		<div className="flex flex-row items-center gap-4">
			<input
				type="checkbox"
				className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-full"
				onChange={onChange}
				checked={isChecked}
			/>
			<p>{label}</p>
		</div>
	);
};
export default Checkbox;
