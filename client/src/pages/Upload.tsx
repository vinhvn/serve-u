import React, { useState } from 'react';
import { getApiKey, getUsername } from '../services/auth';

const MAX_FILE_SIZE_MB = 4;

function Upload() {
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');

  const handleUpload = () => {
    setError('');
    const input = document.getElementById('fileUpload') as HTMLInputElement;

    if (!input) {
      setError('Internal error.');
      return;
    }

    input.onchange = () => {
      if (!input.files) {
        setError('This browser does not support the `files` property.');
        return;
      }
      const f = input.files[0];
      if (!f) {
        setError('No file was uploaded.');
        return;
      }
      if (f.size > 1024 * 1024 * MAX_FILE_SIZE_MB) {
        setError('The uploaded file is too large.');
        setFilename('');
        return;
      }
      setFilename(f.name);
    };
    input.click();
  };

  const handleSubmit = async () => {
    setError('');
    if (!filename) {
      setError('No file was uploaded.');
      return;
    }
    // convert to format that is sendable
    const form = document.getElementById('form') as HTMLFormElement;
    const formData = new FormData(form);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Api-Key': getApiKey(),
        Username: getUsername(),
      },
      body: formData,
    });

    const upload = await res.text();
    window.location.href = `/${upload}`;
  };

  const formatFilename = () =>
    filename.length > 11 ? `${filename.slice(0, 11)}...` : filename;

  return (
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
      <h2 className="text-xl font-bold pb-2">Upload a file</h2>
      <hr />
      <p
        className={`mt-4 text-sm font-semibold text-green-600 ${
          filename ? '' : 'invisible'
        }`}
      >
        File {`'${formatFilename()}'`} successfully uploaded!
      </p>
      <p className="mt-4 text-xs text-gray-500">Max file size of 4MB</p>
      <button
        type="button"
        onClick={handleUpload}
        className="mt-2 w-full bg-white border border-solid border-red-600 hover:bg-gray-100 text-red-600 text-sm font-semibold py-3 rounded-br-lg focus:outline-none"
      >
        Choose a File
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!filename}
        className={`mt-4 w-full text-white text-sm font-semibold py-3 rounded-br-lg focus:outline-none transition-colors ${
          filename
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gray-500 cursor-not-allowed'
        }`}
      >
        Submit
      </button>
      <form
        id="form"
        method="post"
        encType="multipart/form-data"
        className="hidden"
      >
        <input
          id="fileUpload"
          name="file"
          type="file"
          accept="audio/*,video/*,image/*"
          multiple={false}
        />
      </form>
    </div>
  );
}

export default Upload;
