function ProgressBar({ progressBarPercentage }) {
  return (
    <div className="relative h-3 w-full rounded-full bg-stone-600 lg:h-5">
      <div
        className={`absolute top-0 left-0 h-3 rounded-full bg-yellow-600 lg:h-5`}
        style={{ width: `${progressBarPercentage}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
