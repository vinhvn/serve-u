import React, { ReactElement, useState, useEffect } from 'react';
import Loader from '../components/Loader';

interface Props {}

function Index(_props: Props): ReactElement {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Loader loaded={loaded} />
      <div>Main Content</div>
    </div>
  );
}

export default Index;
