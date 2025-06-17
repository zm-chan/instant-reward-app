function ProgressBar({ progressBarPercentage }) {
  return (
    <div className="h-3 w-full bg-stone-600 rounded-full relative lg:h-5">
      <div
        className={`absolute top-0 left-0 bg-yellow-600 h-3 rounded-full lg:h-5`}
        style={{ width: `${progressBarPercentage}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
