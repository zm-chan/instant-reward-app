import { useEffect, useState } from "react";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Reward from "./pages/Reward";
import Login from "./pages/Login";

function App() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserState(user);
      // console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  if (!userState) {
    return <Login />;
  }

  return <Reward />;
}

export default App;
