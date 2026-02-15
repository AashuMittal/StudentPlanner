import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Budget from "./Components/Budget/Budget";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import Home from "./Components/Dashboard/Home";
import Profile from "./Components/Dashboard/Profile";

import EditDetail from "./Components/LoginPart/EditDetail";
import ForgotPassword from "./Components/LoginPart/ForgotPassword";
import Login from "./Components/LoginPart/Login";
import ResetPassword from "./Components/LoginPart/ResetPassword";
import Signup from "./Components/LoginPart/Signup";
import StudyTask from "./Components/Sudy/StudyTask";
import Notes from "./Components/Note/Notes";
import Gamification from "./Components/Gamification/Gamification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit" element={<EditDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="budget" element={<Budget />} />
          <Route path="studytask" element={<StudyTask/>}/>
          <Route path="note" element={<Notes/>}/>
          <Route path="gamification" element={<Gamification/>}/>
          </Route>
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
