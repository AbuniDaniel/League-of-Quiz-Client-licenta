import "./login.css";
import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Menu from  "../../fragments/menu/menu"
import { authContext } from "../../helpers/authContext"
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(authContext);

  const login = (event) => {
    event.preventDefault();
    Axios.post("https://daniel-licenta-api.herokuapp.com/login", {
      email: email,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        notification["error"]({
          message: 'Login failed',
          description: response.data.error,
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
          email: response.data.email,
          id: response.data.id,
          status: true,
        })
        navigate("/play");
      }
    });
  };

  const userAuthenticated = () => {
    Axios.get("https://daniel-licenta-api.herokuapp.com/isUserAuth", 
      {headers: {
        "x-access-token": localStorage.getItem("token"),
    }}).then((response) => {
      console.log(response);
    })
  }
  return (
    
    <>
    <Menu />
    <div className="container">
    
    <form name="form1" className="box">
      
      <h5>AUTENTIFICARE</h5>
        <input type="text" placeholder="Email" autoComplete="on" className="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        />
        <input type="password" placeholder="Passsword" autoComplete="off" className="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        />
        <button onClick={login} className="btn1">Login</button>
      </form>
        <Link to="/register" className="dnthave">Creează un cont nou</Link>
    </div> 
    </>
  );
}

export default Login;