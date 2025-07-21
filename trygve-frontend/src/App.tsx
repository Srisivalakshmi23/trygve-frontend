// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import OnboardingFlow from './components/OnboardingFlow';
// import Login from './components/Login';
// import Signup from './components/SignUp';
// import OTPVerification from './components/OTPVerification';
// import Dashboard from './components/Dashboard';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Routes>
//           <Route path="/" element={<Navigate to="/onboarding" replace />} />
//           <Route path="/onboarding" element={<OnboardingFlow />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/otp-verification" element={<OTPVerification />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;



// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import OnboardingFlow from './components/Onboarding/OnboardingFlow.tsx';
// import Login from './components/auth/Login.tsx';
// import Signup from './components/auth/SignUp.tsx';
// import OTPVerification from './components/auth/OTPVerification.tsx';
// import Dashboard from './components/Dashboard/Dashboard.tsx';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Routes>
//           <Route path="/" element={<Navigate to="/onboarding" replace />} />
//           <Route path="/onboarding" element={<OnboardingFlow />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/otp-verification" element={<OTPVerification />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="*" element={<Navigate to="/onboarding" replace />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


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
      </Routes>
    </Router>
  );
}

export default App;
