function ErrorModal({ errorMessage, setError }) {
  function handleCloseModal(event) {
    if (
      event.target.tagName === "SECTION" ||
      (event.target.tagName === "BUTTON" &&
        event.target.textContent.toLowerCase() === "close")
    ) {
      setError(false);
    }
  }

  return (
    <section
      onClick={handleCloseModal}
      className="absolute inset-0 bg-stone-950/70 flex items-center justify-center text-yellow-400 px-6"
    >
      <div className="bg-stone-700 min-w-2xs rounded-xl p-6 xs:min-w-sm lg:min-w-md">
        <h3 className="text-lg font-semibold xs:text-xl lg:text-2xl">
          {errorMessage}
        </h3>
        <div className="mt-6 text-right xs:mt-8 lg:mt-10">
          <button className="border border-yellow-700 py-2 px-4 rounded-lg text-sm xs:text-lg lg:text-xl">
            Close
          </button>
        </div>
      </div>
    </section>
  );
}

export default ErrorModal;
