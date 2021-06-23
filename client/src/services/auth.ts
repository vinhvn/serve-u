export const getUsername = () => {
  if (window) {
    const username = window.sessionStorage.getItem('username');
    if (typeof username === 'string') {
      return username;
    }
  }
  return '';
};

export const getApiKey = () => {
  if (window) {
    const apiKey = window.sessionStorage.getItem('apiKey');
    if (typeof apiKey === 'string') {
      return apiKey;
    }
  }
  return '';
};

export const handleLogin = async (password: string) => {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (res.status === 401) {
    throw new Error(`Bad login`);
  } else {
    const { apiKey, username } = await res.json();
    window.sessionStorage.setItem('apiKey', apiKey);
    window.sessionStorage.setItem('username', username);
  }
};

export const isLoggedIn = () => {
  const username = getUsername();
  const apiKey = getApiKey();
  return !!username && !!apiKey;
};

export const handleLogout = () => {
  window.sessionStorage.setItem('apiKey', '');
  window.sessionStorage.setItem('username', '');
};
