import "./login.css";
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Menu from  "../../fragments/menu/menu"
import { authContext } from "../../helpers/authContext"
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(authContext);

  const login = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        notification["error"]({
          message: 'Login failed',
          description:
            response.data.error,
        });
      } else {
        notification["success"]({
          message: 'Logged in successfully',
          description:
            "",
        });
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        })
        navigate("/play");
      }
    });
  };

  const userAuthenticated = () => {
    Axios.get("http://localhost:3001/isUserAuth", 
      {headers: {
        "x-access-token": localStorage.getItem("token"),
    }}).then((response) => {
      console.log(response);
    })
  }

  const logout = () => {
    localStorage.removeItem("token");
  }

  
  return (
    
    <>
    <Menu />
    <div className="container">
    
    <form name="form1" className="box">
      
      <h5>AUTENTIFICARE</h5>
        <input type="text" placeholder="Username" autoComplete="on"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        />
        <input type="password" placeholder="Passsword" id="pwd" autoComplete="off"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        />
        <button onClick={login} className="btn1">Login</button>
      </form>
        <a href="#" className="dnthave">Creează un cont nou</a>
    </div> 
    </>
  );
}

export default Login;