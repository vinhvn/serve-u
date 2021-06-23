import React, { useEffect, useState } from 'react';
import { getApiKey, getUsername } from '../services/auth';

type Response = {
  id: string;
  type: string;
};

function Files() {
  const [files, setFiles] = useState<Response[]>([]);

  useEffect(() => {
    let _isMounted = false;
    const username = getUsername();

    fetch(`${process.env.REACT_APP_API_URL}/list/${username}`, {
      headers: {
        'Api-Key': getApiKey(),
        Username: username,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!_isMounted) {
          setFiles(json.files);
        }
      })
      .catch((e) => {
        window.location.href = '/404';
      });

    return () => {
      _isMounted = true;
    };
  }, []);

  const renderCards = () => {
    if (files.length === 0) {
      return (
        <a
          href="/upload"
          className="block w-full text-sm py-4 px-6 border border-solid shadow"
        >
          No uploads found. Click here to go to the uploader.
        </a>
      );
    }
    const arr = [];
    for (const file of files) {
      arr.push(
        <a
          href={file.id}
          key={file.id}
          className="flex flex-col sm:flex-row w-full text-sm py-4 px-8 border border-solid shadow mb-2"
        >
          <span className="sm:w-3/4 break-words">
            <span className="font-semibold">Name: </span>
            {file.id}
          </span>
          <span>
            <span className="font-semibold">Type: </span>
            {file.type}
          </span>
        </a>
      );
    }
    return arr;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <h2 className="text-3xl font-semibold pb-4 mt-16 sm:mt-32">Files</h2>
      {renderCards()}
    </div>
  );
}

export default Files;
