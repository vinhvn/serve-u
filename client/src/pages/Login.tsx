import React, { useState } from 'react';
import { handleLogin as authenticate } from '../services/auth';

function Login() {
  const [password, setPassword] = useState('');
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hasPasswordOrNotInteracted = () => password || (!password && !clicked);

  const handleLogin = async () => {
    if (!password) {
      setError('No password was entered.');
      setClicked(true);
      return;
    }

    setLoading(true);
    try {
      await authenticate(password);
    } catch (e) {
      setError('No repository with a matching password was found.');
      setLoading(false);
      return;
    }
    // successful login
    window.location.href = '/';
  };

  return (
    <div className="pb-24">
      <div className="max-w-xl p-4 border-solid border shadow mt-16 sm:mt-32 mx-4 sm:mx-auto">
        {error ? (
          <div className="bg-red-100 border border-red-500 p-4 mb-4 rounded-br-lg flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-xs">
              {error} Please try again or contact your administrator for more
              help.
            </p>
          </div>
        ) : null}
        <h2 className="text-xl font-bold pb-2">Log in to your repository</h2>
        <hr />
        <div className="py-4">
          <h3 className="text-sm font-bold pb-2">
            Password
            <span
              className={
                hasPasswordOrNotInteracted() ? 'text-black' : 'text-red-600'
              }
            >
              *
            </span>
          </h3>
          <input
            type="text"
            value={password}
            placeholder="Enter your password"
            onBlur={() => setClicked(true)}
            onChange={(e) => setPassword(e.target.value)}
            className="text-sm w-full border-solid border px-3 py-2"
          />
          {hasPasswordOrNotInteracted() ? (
            <div className="invisible pt-2 text-sm">placeholder</div>
          ) : (
            <div className="flex flex-initial flex-row items-center text-sm pt-2 font-bold text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-1">Password is required</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="flex justify-center items-center w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-br-lg focus:outline-none"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <span>Log In</span>
          )}
        </button>
        <div className="flex flex-row items-center justify-between py-4">
          <div className="border-solid border-b w-1/4 h-1" />
          <p className="text-sm font-bold">Need an account?</p>
          <div className="border-solid border-b w-1/4 h-1" />
        </div>
        <p className="text-xs font-bold text-center">
          Please contact your{' '}
          <a
            href="mailto:vinhhnguyen@cmail.carleton.ca"
            className="text-red-600 hover:text-red-700"
          >
            administrator
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
