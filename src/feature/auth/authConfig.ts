export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_APPLICATION_ID,
    authority: "https://login.microsoftonline.com/common/" + import.meta.env.VITE_TENANT_INFO,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: true,
  },
};
