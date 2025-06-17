import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";

function Login() {
  const [error, setError] = useState("");

  console.log(error);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (error) {
      // console.log(error.message);
      setError(error.message);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-800 px-4 py-8 text-yellow-400">
      <form
        onSubmit={handleSubmit}
        className="grid w-5/6 max-w-xs gap-y-5 rounded-2xl bg-stone-900/70 px-4 py-6 text-center shadow-xl sm:max-w-sm sm:gap-y-7 sm:px-6 sm:py-8 sm:shadow-2xl lg:max-w-md lg:px-8 lg:py-10"
      >
        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
          Login Form
        </h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="h-9 rounded-md border border-yellow-400 px-3 py-2 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="h-9 rounded-md border border-yellow-400 px-3 py-2 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-yellow-400 px-4 py-2 text-sm font-medium whitespace-nowrap text-stone-800 capitalize sm:py-5 sm:text-base lg:py-6 lg:text-lg"
        >
          Login
        </button>
        {error.includes("invalid") && (
          <span className="text-sm text-red-600 lg:text-lg">
            Wrong email or password!
          </span>
        )}
        {error.includes("network") && (
          <span className="text-sm text-red-600 lg:text-lg">
            You are having network problem!
          </span>
        )}
      </form>
    </main>
  );
}

export default Login;
