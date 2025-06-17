function ConfirmationModal({ text, handleConfirmModal, handleCancelModal }) {
  function handleCloseModal(event) {
    if (
      event.target.tagName === "SECTION" ||
      (event.target.tagName === "BUTTON" &&
        event.target.textContent.toLowerCase() === "cancel")
    ) {
      handleCancelModal();
    } else if (
      event.target.tagName === "BUTTON" &&
      event.target.textContent.toLowerCase() === "confirm"
    ) {
      handleConfirmModal();
    }
  }

  return (
    <section
      onClick={handleCloseModal}
      className="absolute inset-0 bg-stone-950/70 flex items-center justify-center text-yellow-400 px-6"
    >
      <div className="bg-stone-700 min-w-2xs rounded-xl p-6 xs:min-w-sm lg:min-w-md">
        <h3 className="text-lg font-semibold xs:text-xl lg:text-2xl">{text}</h3>
        <div className="mt-6 text-right space-x-3 xs:mt-8 xs:space-x-5 lg:mt-10 lg:space-x-7">
          <button className="border border-yellow-700 py-2 px-4 rounded-lg text-sm xs:text-lg lg:text-xl">
            Confirm
          </button>
          <button className="border border-yellow-700 py-2 px-4 rounded-lg text-sm xs:text-lg lg:text-xl">
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirmationModal;
