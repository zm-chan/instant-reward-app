import { useRef, useState } from "react";
import useFetchDoc from "../hooks/useFetchDoc";
import { getData, setData } from "../services/apiFirebase";
import useSetDoc from "../hooks/useSetDoc";
import { getTotalXPForLevel, moneyRanges } from "../util";
import { CloudDownload, CloudUpload, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import ProgressBar from "../components/ProgressBar";
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorModal from "../components/ErrorModal";
import LoadingIndicator from "../components/LoadingIndicator";

const retrievedData = JSON.parse(localStorage.getItem("appData")) || {
  moneyAmount: 0,
  eXPAmount: 0,
  eXPLevel: 1,
};

function Reward() {
  const [moneyAmount, setMoneyAmount] = useState(retrievedData.moneyAmount);
  const [eXPAmount, setEXPAmount] = useState(retrievedData.eXPAmount);
  const [eXPLevel, setEXPLevel] = useState(retrievedData.eXPLevel);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const temperoraryAmountRef = useRef(0);

  const {
    isLoading: isFetchingLoading,
    error: isFetchingError,
    setError: setFetchingError,
    query,
  } = useFetchDoc({
    queryFn: getData,
    onSuccess: (data) => {
      setMoneyAmount(data.moneyAmount);
      setEXPAmount(data.eXPAmount);
      setEXPLevel(data.eXPLevel);
      localStorage.setItem("appData", JSON.stringify(data));
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

  const totalEXP = getTotalXPForLevel(eXPLevel);

  const progressBarPercentage = Math.trunc((eXPAmount / totalEXP) * 100);

  function handleOpenAmountModal(amount) {
    temperoraryAmountRef.current = amount;

    setShowAmountModal(true);
  }

  function handleConfirmAmountModal() {
    setMoneyAmount((prevMoneyAmount) => {
      return prevMoneyAmount + Number(temperoraryAmountRef.current);
    });

    let updatedEXPAmount = eXPAmount + Number(temperoraryAmountRef.current);
    let currentLevel = eXPLevel;

    while (updatedEXPAmount >= getTotalXPForLevel(currentLevel)) {
      updatedEXPAmount -= getTotalXPForLevel(currentLevel);
      currentLevel++;
    }

    while (updatedEXPAmount < 0 && currentLevel > 1) {
      currentLevel--;
      updatedEXPAmount += getTotalXPForLevel(currentLevel);
    }

    if (currentLevel === 1 && updatedEXPAmount < 0) {
      currentLevel = 1;
      updatedEXPAmount = 0;
    }

    setEXPAmount(updatedEXPAmount);
    setEXPLevel(currentLevel);

    // let updatedEXPAmount = eXPAmount + Number(temperoraryAmountRef.current);
    // let currentLevel = eXPLevel;
    // let totalEXPForCurrentLevel = et currentLevel = eXPLevel;;

    // if (updatedEXPAmount >= totalEXPForCurrentLevel) {
    //   while (updatedEXPAmount >= totalEXPForCurrentLevel) {
    //     updatedEXPAmount = updatedEXPAmount - totalEXPForCurrentLevel;
    //     currentLevel++;
    //     totalEXPForCurrentLevel = getTotalXPForLevel(currentLevel);
    //   }
    //   setEXPAmount(updatedEXPAmount);
    //   setEXPLevel(currentLevel);
    // } else if (updatedEXPAmount < 0) {
    //   if (eXPLevel === 1) {
    //     setEXPAmount(0);
    //     setShowModal(false);
    //     return;
    //   }

    //   while (updatedEXPAmount < 0) {
    //     currentLevel--;
    //     totalEXPForCurrentLevel = getTotalXPForLevel(currentLevel);
    //     updatedEXPAmount = updatedEXPAmount + totalEXPForCurrentLevel;

    //     if (currentLevel === 1 && updatedEXPAmount < 0) {
    //       setEXPAmount(0);
    //       setEXPLevel(1);
    //       setShowModal(false);
    //       return;
    //     }
    //   }

    //   setEXPAmount(updatedEXPAmount);
    //   setEXPLevel(currentLevel);
    // } else {
    //   setEXPAmount(updatedEXPAmount);
    // }
    setShowAmountModal(false);

    const updatedData = {
      moneyAmount: moneyAmount,
      eXPAmount: eXPAmount,
      eXPLevel: eXPLevel,
    };

    // save to localstorage
    localStorage.setItem("appData", JSON.stringify(updatedData));
  }

  function handleCancelAmountModal() {
    temperoraryAmountRef.current = 0;
    setShowAmountModal(false);
  }

  function handleOpenUploadModal() {
    setShowUploadModal(true);
  }
  async function handleConfirmUploadModal() {
    setShowUploadModal(false);
    await mutate({ moneyAmount, eXPAmount, eXPLevel });

    // const updatedData = {
    //   moneyAmount: moneyAmount,
    //   eXPAmount: eXPAmount,
    //   eXPLevel: eXPLevel,
    // };

    // // save to localstorage
    // localStorage.setItem("appData", JSON.stringify(updatedData));
  }
  function handleCancelUploadModal() {
    setShowUploadModal(false);
  }

  function handleOpenDownloadModal() {
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
                className="flex items-center gap-2 rounded-md bg-stone-700 px-2 py-1 xs:text-lg lg:text-xl"
              >
                <span>Upload</span>
                <CloudUpload />
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
          <section className="mt-8 lg:mt-10">
            <h2 className="text-lg font-bold xs:text-xl lg:text-2xl">
              Did Good Thing
            </h2>
            <article className="mt-4 flex flex-wrap gap-x-6 gap-y-4 xs:text-xl md:gap-x-3 lg:gap-x-8 lg:text-2xl">
              {moneyRanges.map((range) => {
                return (
                  <button
                    key={range + "add"}
                    className="min-w-[80px] rounded-xl bg-stone-700 px-4 py-2 xs:min-w-[100px]"
                    onClick={() => handleOpenAmountModal(range)}
                  >
                    +{range}
                  </button>
                );
              })}
            </article>
          </section>
          <section className="mt-8 lg:mt-10">
            <h2 className="text-lg font-bold lg:text-2xl">Did Bad Thing</h2>
            <article className="mt-4 flex flex-wrap gap-x-6 gap-y-4 xs:text-xl md:gap-x-3 lg:gap-x-8 lg:text-2xl">
              {moneyRanges.map((range) => {
                return (
                  <button
                    key={range + "minus"}
                    className="min-w-[80px] rounded-xl bg-stone-700 px-4 py-2 xs:min-w-[100px]"
                    onClick={() => handleOpenAmountModal(-range)}
                  >
                    -{range}
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
