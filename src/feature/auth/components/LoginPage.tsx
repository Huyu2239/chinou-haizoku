import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../useAuth";
import { InteractionStatus } from "@azure/msal-browser";
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

import ResultPage from './ResultPage';

const LoginPage = () => {
	const { login, fetchUserData, inProgress } = useAuth();

	useEffect(() => {
		const checkAuthentication = async () => {
			const userToken = Cookies.get("user_token");
	
			if (userToken) {
				console.log("User is already logged in:", userToken);
				// setIsCollegeUser(true);
				return;
			};
			if (inProgress === InteractionStatus.None) {
				console.log("not in progress");
				return;
			}
			fetchUserData().then((userToken) => {
				if (userToken) {
					console.log("User authenticated");
					// setIsCollegeUser(true);
					Cookies.set("user_token", userToken, { expires: 90 , secure: true});
				} else {
					console.warn("User does not belong to the required organization.");
					// setIsCollegeUser(false);
				}
			}).catch((error) => {
				console.error("Authentication error:", error);
				// setIsCollegeUser(false);
			});
		};
		checkAuthentication();
	}, [inProgress, fetchUserData]);

	return (
    <div className="App">
			<AuthenticatedTemplate>
				<ResultPage />
			</AuthenticatedTemplate>
			<UnauthenticatedTemplate>
				<div>Sorry, you are not authorized to access this portal.<button onClick={login}>Login</button></div>
			</UnauthenticatedTemplate>
		</div>);
	// if (isCollegeUser) {
	// 	return <div>
	// 		Welcome to the college portal!
	// 		<ResultPage />
	// 	</div>;
	// } else {
	// 	return <div>Sorry, you are not authorized to access this portal.<button onClick={login}>Login</button></div>;
	// }
};

export default LoginPage;
