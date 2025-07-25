import { useRef, useState } from "react";
import useFetchDoc from "../hooks/useFetchDoc";
import { getData, setData } from "../services/apiFirebase";
import useSetDoc from "../hooks/useSetDoc";
import { getTotalXPForLevel, moneyRanges, calculateEXPAndLevel } from "../util";
import { CloudDownload, CloudUpload, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import ProgressBar from "../components/ProgressBar";
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorModal from "../components/ErrorModal";
import LoadingIndicator from "../components/LoadingIndicator";

const retrievedData = JSON.parse(localStorage.getItem("appData")) || {
  moneyAmount: 0,
  exponent: 1.05,
  dataAhead: false,
};

const { eXPAmountCalculate, eXPLevelCalculate } = calculateEXPAndLevel(
  retrievedData.moneyAmount,
  retrievedData.exponent,
);

retrievedData.eXPAmount = eXPAmountCalculate;
retrievedData.eXPLevel = eXPLevelCalculate;

function Reward() {
  const [moneyAmount, setMoneyAmount] = useState(retrievedData.moneyAmount);
  const [eXPAmount, setEXPAmount] = useState(retrievedData.eXPAmount);
  const [eXPLevel, setEXPLevel] = useState(retrievedData.eXPLevel);
  const inputRef = useRef();
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const temperoraryAmountRef = useRef(0);
  const [dataAhead, setDataAhead] = useState(retrievedData.dataAhead);
  const [showUploadRequiredModal, setShowUploadRequiredModal] = useState(false);

  const numberExponent = inputRef?.current?.value
    ? Number(inputRef?.current?.value)
    : retrievedData.exponent;

  const {
    isLoading: isFetchingLoading,
    error: isFetchingError,
    setError: setFetchingError,
    query,
  } = useFetchDoc({
    queryFn: getData,
    onSuccess: (data) => {
      setMoneyAmount(data.moneyAmount);

      const { eXPAmountCalculate, eXPLevelCalculate } = calculateEXPAndLevel(
        data.moneyAmount,
        data.exponent,
      );

      setEXPAmount(eXPAmountCalculate);
      setEXPLevel(eXPLevelCalculate);
      const updatedData = {
        moneyAmount: data.moneyAmount,
        exponent: data.exponent,
        dataAhead: false,
      };
      localStorage.setItem("appData", JSON.stringify(updatedData));
      setDataAhead(false);
    },
  });

  const {
    mutate,
    isLoading: isSettingLoading,
    setError: setSettingError,
    error: isSettingError,
  } = useSetDoc({
    mutationFn: setData,
    onSuccess: () => query(),
  });

  const formattedMoney = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(moneyAmount);

  const totalEXP = getTotalXPForLevel(eXPLevel, numberExponent);

  const progressBarPercentage = Math.trunc((eXPAmount / totalEXP) * 100);

  function handleOpenAmountModal(amount) {
    temperoraryAmountRef.current = amount;

    setShowAmountModal(true);
  }

  function handleConfirmAmountModal() {
    const updatedMoneyAmount =
      moneyAmount + Number(temperoraryAmountRef.current);

    setMoneyAmount(updatedMoneyAmount);

    let updatedEXPAmount = eXPAmount + Number(temperoraryAmountRef.current);
    let currentLevel = eXPLevel;

    while (
      updatedEXPAmount >= getTotalXPForLevel(currentLevel, numberExponent)
    ) {
      updatedEXPAmount -= getTotalXPForLevel(currentLevel, numberExponent);
      currentLevel++;
    }

    setEXPAmount(updatedEXPAmount);
    setEXPLevel(currentLevel);
    setShowAmountModal(false);
    setDataAhead(true);

    const updatedData = {
      moneyAmount: updatedMoneyAmount,
      exponent: numberExponent,
      dataAhead: true,
    };

    localStorage.setItem("appData", JSON.stringify(updatedData));
  }

  function handleCancelAmountModal() {
    temperoraryAmountRef.current = 0;
    setShowAmountModal(false);
  }

  function handleOpenUploadModal() {
    setShowUploadModal(true);
  }
  function handleConfirmUploadModal() {
    setShowUploadModal(false);
    if (!navigator.onLine) {
      setSettingError(true);
      return;
    }
    mutate({ moneyAmount, exponent: numberExponent });
  }
  function handleCancelUploadModal() {
    setShowUploadModal(false);
  }

  function handleOpenDownloadModal() {
    if (dataAhead) {
      return setShowUploadRequiredModal(true);
    }

    setShowDownloadModal(true);
  }
  function handleConfirmDownloadModal() {
    setShowDownloadModal(false);
    query();
  }
  function handleCancelDownloadModal() {
    setShowDownloadModal(false);
  }

  function handleOpenLogoutModal() {
    setShowLogoutModal(true);
  }
  function handleConfirmLogoutModal() {
    setShowLogoutModal(false);
    signOut(auth);
  }
  function handleCancelLogoutModal() {
    setShowLogoutModal(false);
  }

  function handleExponentValue() {
    const extractedExponentValue = Number(inputRef.current.value);

    const finalStringExponentValue =
      extractedExponentValue < 1 || Number.isNaN(extractedExponentValue)
        ? "1"
        : inputRef.current.value;

    const { eXPAmountCalculate, eXPLevelCalculate } = calculateEXPAndLevel(
      moneyAmount,
      Number(finalStringExponentValue),
    );

    setEXPAmount(eXPAmountCalculate);
    setEXPLevel(eXPLevelCalculate);

    const updatedData = {
      moneyAmount: moneyAmount,
      exponent: Number(finalStringExponentValue),
      dataAhead: false,
    };

    localStorage.setItem("appData", JSON.stringify(updatedData));
  }

  return (
    <>
      <main
        className={`min-h-dvh bg-stone-800 px-4 py-8 text-yellow-400 md:flex md:place-items-center ${
          (showAmountModal ||
            showUploadModal ||
            showDownloadModal ||
            showLogoutModal) &&
          "blur-xs"
        }`}
      >
        <div className="mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <div className="flex flex-col gap-y-3 lg:flex-row lg:items-center">
            <h1 className="text-center text-lg font-bold xs:text-2xl lg:text-3xl">
              Your Future Money
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 xs:mt-2 lg:ms-auto lg:gap-4">
              <button
                onClick={handleOpenUploadModal}
                className="relative flex items-center gap-2 rounded-md bg-stone-700 px-2 py-1 xs:text-lg lg:text-xl"
              >
                <span>Upload</span>
                <CloudUpload />
                {dataAhead && (
                  <span className="absolute -top-1 -right-1 size-3 rounded-full bg-amber-700"></span>
                )}
              </button>
              <button
                onClick={handleOpenDownloadModal}
                className="flex items-center gap-2 rounded-md bg-stone-700 px-2 py-1 xs:text-lg lg:text-xl"
              >
                <span>Download</span>
                <CloudDownload />
              </button>
              <button
                onClick={handleOpenLogoutModal}
                className="flex items-center gap-2 rounded-md bg-stone-700 px-2 py-1 xs:text-lg lg:text-xl"
              >
                <span>Logout</span>
                <LogOut />
              </button>
            </div>
          </div>
          <p className="mt-8 rounded-md bg-stone-700 p-4 text-center text-4xl font-bold text-amber-700 xs:text-5xl lg:text-6xl">
            <span className="break-all">{formattedMoney}</span>
          </p>
          <section className="mt-8 flex flex-col gap-y-3">
            <h2 className="flex justify-between xs:text-lg lg:text-xl">
              Lifetime EXP <span>Level {eXPLevel}</span>
            </h2>
            <ProgressBar progressBarPercentage={progressBarPercentage} />
            <p className="text-sm text-yellow-700 xs:text-base lg:text-lg">
              <span>{eXPAmount}</span>/<span>{totalEXP}</span>
            </p>
          </section>
          <section className="mt-8 space-x-3 text-lg xs:text-xl lg:mt-10 lg:text-2xl">
            <label
              htmlFor="exponent"
              className="mb-4 block font-bold min-[384px]:inline"
            >
              Exponent:
            </label>
            <input
              ref={inputRef}
              type="text"
              defaultValue={retrievedData.exponent}
              id="exponent"
              className="max-w-1/4 rounded-md border-2 border-stone-600 px-4 py-2 font-bold transition outline-none focus:border-yellow-700 md:max-w-1/9"
            />
            <button
              className="min-w-[80px] rounded-xl bg-stone-700 px-4 py-2 xs:min-w-[100px]"
              onClick={handleExponentValue}
            >
              Change
            </button>
          </section>
          <section className="mt-8 lg:mt-10">
            <h2 className="text-lg font-bold xs:text-xl lg:text-2xl">
              Action's Value
            </h2>
            <article className="mt-4 flex flex-wrap gap-x-6 gap-y-4 xs:text-xl md:gap-x-3 lg:gap-x-8 lg:text-2xl">
              {moneyRanges.map((range) => {
                return (
                  <button
                    key={range + "add"}
                    className="min-w-[80px] rounded-xl bg-stone-700 px-4 py-2 xs:min-w-[100px]"
                    onClick={() => handleOpenAmountModal(range)}
                  >
                    {range}
                  </button>
                );
              })}
            </article>
          </section>
        </div>
      </main>
      {(isFetchingLoading || isSettingLoading) && <LoadingIndicator />}
      {isFetchingError && (
        <ErrorModal
          errorMessage="Something Went Wrong With Fetching!"
          setError={setFetchingError}
        />
      )}
      {isSettingError && (
        <ErrorModal
          errorMessage="Something Went Wrong With Setting!"
          setError={setSettingError}
        />
      )}
      {showUploadRequiredModal && (
        <ErrorModal
          errorMessage="You Have To Upload Data First!"
          setError={setShowUploadRequiredModal}
        />
      )}
      {showAmountModal ? (
        <ConfirmationModal
          text="Have You Done Something?"
          handleConfirmModal={handleConfirmAmountModal}
          handleCancelModal={handleCancelAmountModal}
        />
      ) : null}
      {showUploadModal ? (
        <ConfirmationModal
          text="Do You Want To Upload?"
          handleConfirmModal={handleConfirmUploadModal}
          handleCancelModal={handleCancelUploadModal}
        />
      ) : null}
      {showDownloadModal ? (
        <ConfirmationModal
          text="Do You Want To Download?"
          handleConfirmModal={handleConfirmDownloadModal}
          handleCancelModal={handleCancelDownloadModal}
        />
      ) : null}
      {showLogoutModal ? (
        <ConfirmationModal
          text="Do You Want To Logout?"
          handleConfirmModal={handleConfirmLogoutModal}
          handleCancelModal={handleCancelLogoutModal}
        />
      ) : null}
    </>
  );
}

export default Reward;
