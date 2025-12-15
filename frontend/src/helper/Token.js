import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = "token";

export const saveAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const decodeAccessToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode access token");
    return null;
  }
};
