import React, { useState, useEffect } from 'react';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';

import { isLoggedIn } from './services/auth';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Login from './components/Login';

function App() {
  const [loaded, setLoaded] = useState(false);

  // mock loading effect
  useEffect(() => {
    if (!window.sessionStorage.getItem('isLoaded')) {
      const timer = setTimeout(() => {
        window.sessionStorage.setItem('isLoaded', 'true');
        setLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return setLoaded(true);
  }, []);

  console.log(isLoggedIn());

  const PrivateRoute = ({
    component: Component,
    ...rest
  }: Record<string, any>) => (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );

  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute exact path="/" component={() => <div>Testing</div>} />
        <PrivateRoute path="/upload" component={Login} />
      </Switch>
      <Loader loaded={loaded} />
    </BrowserRouter>
  );
}

export default App;
