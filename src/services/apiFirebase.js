import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getData() {
  const rewardDocSnap = await getDoc(doc(db, "appData", "rewardData"));

  if (!rewardDocSnap.exists()) {
    throw new Error("No such document");
  }

  return rewardDocSnap.data();
}

export async function setData(rewardData) {
  return await setDoc(doc(db, "appData", "rewardData"), rewardData);
}
