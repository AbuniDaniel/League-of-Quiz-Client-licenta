import Home from "./pages/home/home";
import Play from "./pages/play/play";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import Register from "./pages/register/register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { authContext } from "./helpers/authContext";
import EmailVerify from "./pages/emailVerify/emailVerify";
import ResetPass from "./pages/resetPass/resetPass";
import UserProfile from "./pages/userProfile/userProfile";
import Shop from "./pages/shop/shop";

function App() {


  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    id: 0,
    pfp_src: "",
    status: false,
  });

  useEffect(() => {
    const fetchUserAuth = async () => {
      const response = await Axios
      .get("https://daniel-licenta-api.herokuapp.com/isUserAuth", {
        headers: {
			"x-access-token": localStorage.getItem("token"),
        },
      })
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({
          username: response.data.user.username,
          email: response.data.user.email,
          id: response.data.user.id,
          pfp_src: response.data.result[0].src,
          status: true,
        });
      }
    }

    fetchUserAuth();
  }, []);

  return (
    <>
    
    <authContext.Provider value={{ authState, setAuthState }}>

      <Router>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/users/:id/verify-email" element={<EmailVerify/>} />
          <Route path="/users/:id/reset-pass" element={<ResetPass/>} />
          <Route path="/users/profile/:username" element={<UserProfile/>} />
          <Route path="/shop" element={<Shop/>} />
        </Routes>
      </Router>
    </authContext.Provider>
    </>
  );
}

export default App;
