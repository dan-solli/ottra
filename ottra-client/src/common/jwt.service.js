const ID_TOKEN_KEY = "ottra_token";
const ID_REFRESH_TOKEN_KEY = "ottra_refresh_token";

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

export const getRefreshToken = () => {
	const token = window.localStorage.getItem(ID_REFRESH_TOKEN_KEY)
  return token;
};

export const saveRefreshToken = token => {
  window.localStorage.setItem(ID_REFRESH_TOKEN_KEY, token);
};

export const destroyRefreshToken = () => {
  window.localStorage.removeItem(ID_REFRESH_TOKEN_KEY);
};

export const destroyTokens = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(ID_REFRESH_TOKEN_KEY);
};


export default { 
	getToken, 
	saveToken, 
	destroyToken,
	getRefreshToken, 
	saveRefreshToken, 
	destroyRefreshToken,
	destroyTokens 
};
