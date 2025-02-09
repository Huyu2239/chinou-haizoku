import { useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";

const GRAPH_API = "https://graph.microsoft.com/v1.0/me";

export const useAuth = () => {
  const { instance, accounts, inProgress } = useMsal();

  const login = async () => {
    if (inProgress !== InteractionStatus.None) {
      console.log("Login is already in progress...");
      return;
    }

    try {
      const response = await instance.loginPopup({
        scopes: ["User.Read"],
      });

      if (response.account) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    try {
      const account = accounts[0];
      if (!account) return;
      const tokenResponse = await instance.acquireTokenSilent({
        scopes: ["User.Read"],
        account: account,
      });
      const userResponse = await fetch(GRAPH_API, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
        },
      });
      const userData = await userResponse.json();
      if (!userData.mail) {
        console.error("User data does not contain an email address:", userData);
        return null
      }
      if (!userData.mail.endsWith("hiroshima-cu.ac.jp")) {
        console.log("User authenticated:", userData.mail);
        console.warn("User does not belong to the required organization.");
        return null;
      }

      // success
      const userTokenResponse = await fetch(import.meta.env.VITE_BACKEND_URL + "register?email=" + userData.mail.replace("@", "%40"), {
        method: 'POST',
        mode: "cors",
      });
      const userTokenData = await userTokenResponse.json();
      console.log("User token data:", userTokenData);
      if (!userTokenData || !userTokenData.user_token) {
        console.error("couldn't get user token", userTokenData);
        return null
      }
      return userTokenData.user_token;

    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        instance.acquireTokenPopup({ scopes: ["User.Read"] }).then(fetchUserData);
      } else {
        console.error("Fetching user data failed:", error);
      }
    }
  };

  return { login, fetchUserData, inProgress };
};
