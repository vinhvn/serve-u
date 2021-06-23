import React, { ReactElement, useState, useEffect } from 'react';

interface Props {
  loaded?: boolean;
}

function Loader({ loaded }: Props): ReactElement {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setHidden(true);
      },
      loaded ? 500 : 2000
    );
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div
      className={`absolute inset-0 w-screen h-screen  bg-white ease-in duration-300 transition-opacity ${
        loaded ? 'opacity-0' : 'opacity-100'
      } ${hidden ? 'hidden' : ''}`}
    >
      <div className="flex h-full justify-center items-center">
        <svg
          className={`animate-spin h-8 w-8 text-red-600 ease-in duration-200 transition-opacity
            ${loading ? ' opacity-100' : ' opacity-0'}`}
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
      </div>
    </div>
  );
}

export default Loader;
