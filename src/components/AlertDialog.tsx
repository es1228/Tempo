type AlertDialogProps = {
	text: string;
	isOpen: boolean;
};

const AlertDialog = ({ text, isOpen }: AlertDialogProps) => {
	return (
		<div className={`bg-on-bg/20 dark:bg-on-bg-dark/40 fixed top-20 right-5 z-10000 rounded-3xl p-4 backdrop-blur-3xl transition-all transition-discrete duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
			<p>{text}</p>
		</div>
	);
};
export default AlertDialog;
