import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login-Through-Email";
import Dashboard from "./pages/Dashboard";
import WhereIAmNow from './pages/S2-Module-WhereIAmNow';
import Perspective from './pages/S3-Stage2-Perspective';
import Surrender from './pages/S4-Stage3-Surrender';
import MyPurpose from './pages/S5-Stage4-MyPurpose';
import JourneyComplete from './pages/S6-JourneyComplete';
import LifePlan from './pages/LifePlan';
import RegisterThroughEmail from './pages/Register-Through-Email';
import { SignInPassword } from './pages/SignIn-password';
import { CheckYourEmail } from './pages/Check-Your-Email';

import WatchVideo from './pages/Watch-Video';
import ScrollToTop from './components/ScrollToTop';


function App() {

  return (
    <>
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<LifePlan />} />
          <Route path="/watch-video" element={<WatchVideo />} />
    
          <Route path="/enter-email" element={<RegisterThroughEmail />} />
          <Route path="/enter-password" element={<SignInPassword />} />
          <Route path="/verify-email" element={<CheckYourEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/where-i-am-now" element={<WhereIAmNow />} />
          <Route path="/perspective" element={<Perspective />} />
          <Route path="/surrender" element={<Surrender />} />
          <Route path="/my-purpose" element={<MyPurpose />} />
          <Route path="/journey-complete" element={<JourneyComplete />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
