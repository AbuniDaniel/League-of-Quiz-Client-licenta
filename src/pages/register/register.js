import "../login/login.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import Menu from  "../../fragments/menu/menu"

function Register() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);
  const register = () => {
    
    Axios.post("https://https://daniel-licenta-api.herokuapp.com/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      console.log(response);
    });

  };

  const login = () => {
    Axios.post("https://https://daniel-licenta-api.herokuapp.com/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (!response.data.auth) {
        setLoginStatus(false);
      } else {
        localStorage.setItem("token", response.data.token)
        setLoginStatus(true);
      }
    });
  };

  const userAuthenticated = () => {
    Axios.get("https://https://daniel-licenta-api.herokuapp.com/isUserAuth", 
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
    <div><Menu />
    <div className="container">
    
    <form name="form1" className="box">
      
      <h5>ÎNREGISTRARE</h5>
        <input type="text" placeholder="Username"
        onChange={(e) => {
          setUsernameReg(e.target.value);
        }}
        />
        <input type="password" placeholder="Passsword" id="pwd" autoComplete="off"
        onChange={(e) => {
          setPasswordReg(e.target.value);
        }}
        />
        <input type="password" placeholder="Re-write password" id="pwdchk" autoComplete="off"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        />
        <button onClick={register} className="btn1"> Register </button>
      </form>
        <a href="#" className="dnthave">Creează un cont nou</a>
    </div> 
    </div>
  );
}

export default Register;