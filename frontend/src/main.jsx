import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { RecoilRoot } from 'recoil'
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Dashboards from './Dashboards.jsx'
import SideBar from '../components/SideBar.jsx'
import Navbar from '../components/Navbar.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navbar />}>
              <Route path="/" element={<App />} />
            </Route>
            <Route path="/main" element={<SideBar />}>
              <Route index element={<Dashboards />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </ClerkProvider>
  </React.StrictMode>,
)
