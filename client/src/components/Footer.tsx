import React from 'react';
import {
  isLoggedIn,
  getUsername,
  handleLogout as logout,
} from '../services/auth';

function Footer() {
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return isLoggedIn() ? (
    <div className="fixed bottom-0 w-full text-sm font-semibold text-center p-4 bg-white border-t">
      Signed in as <span className="text-red-600">{getUsername()}</span>.{' '}
      <button
        type="button"
        onClick={handleLogout}
        className="font-semibold text-black hover:text-red-600"
      >
        Click here to sign out.
      </button>
    </div>
  ) : (
    <div className="fixed bottom-0 w-full text-sm font-semibold text-center p-4 bg-white border-t">
      <span className="block sm:inline">
        Made with ☕ by{' '}
        <a
          href="https://github.com/vinhvn/"
          className="font-semibold text-red-600 hover:text-red-700"
        >
          Vincent Nguyen.{' '}
        </a>
      </span>
      <span className="block sm:inline">
        Fork me on{' '}
        <a
          href="https://github.com/vinhvn/serve-u"
          className="font-semibold text-red-600 hover:text-red-700"
        >
          GitHub
        </a>
      </span>
    </div>
  );
}

export default Footer;
