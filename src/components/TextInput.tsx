import type { ChangeEvent } from "react";

type TextInputProps = {
    label: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const TextInput = ({label, onChange, value}: TextInputProps) => {
	return (
		<div className="flex flex-row items-center gap-4">
			<p>{label}</p>
			<input
				type="text"
				placeholder="Name (White)"
				className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary rounded-3xl p-2"
				onChange={onChange}
				value={value}
			/>
		</div>
	);
};
export default TextInput;
