import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import LoginPage from './feature/auth/components/LoginPage'
import ResultPage from './feature/auth/components/ResultPage';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./feature/auth/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);


function App() {
  // const [count, setCount] = useState(0)
  const [isMsalReady, setIsMsalReady] = useState(false);

  useEffect(() => {
    const initMsal = async () => {
      await msalInstance.initialize();
      setIsMsalReady(true);
    };
    initMsal();
  }, []);

  if (!isMsalReady) return <div>Loading...</div>;


  return (
    <>
      <MsalProvider instance={msalInstance}>
        <LoginPage />
        <ResultPage />
      </MsalProvider>
    </>
  )
}

export default App
