import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiKey, getUsername } from '../services/auth';

interface ParamTypes {
  id: string;
}

function File() {
  const { id } = useParams<ParamTypes>();
  const [src, setSrc] = useState('');
  const [type, setType] = useState('');
  const [mimetype, setMimetype] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy link');

  useEffect(() => {
    let _isMounted = false;

    fetch(`${process.env.REACT_APP_API_URL}/asset/${id}`, {
      headers: {
        'Api-Key': getApiKey(),
        Username: getUsername(),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!_isMounted) {
          setSrc(json.url);
          setType(json.type);
          setMimetype(json.mimetype);
        }
      })
      .catch((e) => {
        window.location.href = '/404';
      });

    return () => {
      _isMounted = true;
    };
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(src).catch((e) => {
      throw new Error('Could not copy src to clipboard.');
    });
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy link'), 1000);
  };

  const renderContainer = () => {
    switch (type) {
      case 'image':
        return (
          <img
            width="320"
            height="240"
            src={src}
            alt={src}
            className="w-auto max-h-container"
          />
        );
      case 'audio':
        return (
          <audio controls autoPlay muted className="w-full">
            <source src={src} type={mimetype} />
          </audio>
        );
      case 'video':
        return (
          <video
            width="320"
            height="240"
            controls
            autoPlay
            muted
            className="w-full"
          >
            <source src={src} type={mimetype} />
          </video>
        );
      default:
        return (
          <div>
            Unsupported format. Click <a href={src}>here</a> to access the file
            directly.
          </div>
        );
    }
  };

  return (
    <div className="pb-20">
      <div className="max-w-4xl p-4 border-solid border shadow mt-16 sm:mt-32 mx-4 md:mx-auto">
        <p className="text-3xl font-semibold pb-4 break-words">{id}</p>
        {!src ? (
          <div className="h-56 flex w-full justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-red-600"
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
        ) : (
          <div className="flex justify-center items-center w-full py-6 px-8 bg-gray-200 mb-4">
            {renderContainer()}
          </div>
        )}
        <div className="flex justify-between text-sm">
          <a href="/" className="font-semibold text-black hover:text-red-600">
            Back to files
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="font-semibold text-black hover:text-red-600 focus:outline-none"
          >
            {copyLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default File;
