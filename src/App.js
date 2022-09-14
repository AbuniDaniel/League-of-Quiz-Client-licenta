import Home from "./pages/home/home";
import Play from "./pages/play/play";
import Leaderboard from "./pages/leaderboard/leaderboard";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "axios";
import { authContext } from "./helpers/authContext";

function App() {


  const [authState, setAuthState] = useState({
    username: "",
    email: "",
    id: 0,
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
        console.log(response);
        setAuthState({
          username: response.data.username,
          email: response.data.email,
          id: response.data.id,
          status: true,
        });
      }
    }

    fetchUserAuth();
  }, []);

  return (
    <authContext.Provider value={{ authState, setAuthState }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </authContext.Provider>
  );
}

export default App;
