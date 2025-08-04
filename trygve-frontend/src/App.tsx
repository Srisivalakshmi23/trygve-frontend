import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import Onboard1 from './components/Onboarding/Onboard1';
import Onboard2 from './components/Onboarding/Onboard2';
import Onboard3 from './components/Onboarding/Onboard3';
import Onboard4 from './components/Onboarding/Onboard4';
import Welcome from './components/auth/Welcome';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import SignupFlow from './components/auth/SignupFlow';
import OTPVerification from './components/auth/OTPVerification';
import UserDetails from './components/auth/UserDetails';
import SignupSuccess from './components/auth/SignupSuccess';
// import Dashboard from './components/Dashboard/Dashboard';
// import Login from './pages/Login'; // Create later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/onboard1" element={<Onboard1 />} />
        <Route path="/onboard2" element={<Onboard2 />} />
        <Route path="/onboard3" element={<Onboard3 />} />
        <Route path="/onboard4" element={<Onboard4 />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup-flow" element={<SignupFlow />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/user-details" element={<UserDetails />} />
        <Route path="/signup-success" element={<SignupSuccess />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
