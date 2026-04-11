export type AuthPayload = {
  userID: string;
  access_token: string;
};

const ACCESS_TOKEN_KEY = 'access_token';
const USER_ID_KEY = 'user_id';

export function saveAuth(data: AuthPayload) {
  localStorage.setItem(USER_ID_KEY, data.userID);
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
}

export function clearAuth() {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAuth() {
  if (typeof window === 'undefined') {
    return {
      userId: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }

  const userId = localStorage.getItem(USER_ID_KEY);
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  return {
    userId,
    accessToken,
    isAuthenticated: Boolean(userId && accessToken),
  };
}