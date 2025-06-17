import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../config/firebase";

function Login() {
  const [error, setError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(false);
    } catch (error) {
      setError(true);
    }
  }

  return (
    <main className="bg-stone-800 min-h-dvh py-8 px-4 text-yellow-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="grid w-5/6 max-w-xs gap-y-5 rounded-2xl px-4 py-6 text-center shadow-xl sm:max-w-sm sm:gap-y-7 sm:px-6 sm:py-8 sm:shadow-2xl lg:max-w-md lg:px-8 lg:py-10 bg-stone-900/70"
      >
        <h2 className="text-xl font-semibold sm:text-2xl lg:text-3xl">
          Login Form
        </h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="h-9 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg border border-yellow-400 rounded-md px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="h-9 text-sm sm:py-5 sm:text-base lg:h-12 lg:text-lg border border-yellow-400 rounded-md px-3 py-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium capitalize sm:py-5 sm:text-base lg:py-6 lg:text-lg h-10 px-4 py-2 bg-yellow-400 text-stone-800"
        >
          Login
        </button>
        {error && (
          <span className="text-sm text-red-600 lg:text-lg">
            Wrong email or password!
          </span>
        )}
      </form>
    </main>
  );
}

export default Login;
