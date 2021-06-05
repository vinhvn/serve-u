import React, { ReactElement } from 'react';

interface Props {}

function Index(_props: Props): ReactElement {
  return (
    <div className="w-screen h-screen">
      <div className="flex h-full justify-center items-center">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="ml-2 text-base">Resource Not Found</p>
      </div>
    </div>
  );
}

export default Index;
