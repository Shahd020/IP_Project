// src/api/tokenStore.js
// Holds the Access Token in module memory — NOT in localStorage.
// localStorage is vulnerable to XSS; memory is cleared on tab close (intended behaviour).
// axiosClient.js reads from here; AuthContext.jsx writes to here.
// This module breaks the circular dependency between the two.

let accessToken = null;

export const getToken = () => accessToken;
export const setToken = (token) => { accessToken = token; };
