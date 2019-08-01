const ID_TOKEN_KEY = "ottra_token";

export const getToken = () => {
	const token = window.localStorage.getItem(ID_TOKEN_KEY)
  return token;
};

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export default { getToken, saveToken, destroyToken };
