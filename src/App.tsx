import { useEffect, useState } from 'react'
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import './App.css'

import LoginPage from './feature/auth/components/LoginPage'

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./feature/auth/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const Index = () => {
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
      </MsalProvider>
    </>
  )
}



function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<Index />} />
      </Route>
    )
  );
  return (
    <RouterProvider router={router} />
  )
}

export default App
