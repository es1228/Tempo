const EngineContainer = () => {
	return (
		<div className="bg-on-bg-secondary dark:bg-on-bg-dark-secondary max-h-50 overflow-auto rounded-3xl p-4">
			<h1>Engine Settings</h1>
			<hr className="my-2 rounded" />
			<h1>Difficulty</h1>
			<div className="flex flex-row gap-2 items-center">
				<p className="text-sm">Min</p>
				<input
					type="range"
					name="difficulty"
					id="difficulty"
					list="markers"
					min={0}
					max={30}
				/>
				<p className="text-sm">Max</p>
			</div>
		</div>
	);
};
export default EngineContainer;
