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
    id: 0,
    status: false,
  });

  useEffect(() => {
    Axios
      .get("http://localhost:3001/isUserAuth", {
        headers: {
			"x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
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
