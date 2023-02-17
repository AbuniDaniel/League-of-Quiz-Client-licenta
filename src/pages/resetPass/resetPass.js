import "./resetPass.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Menu from "../../fragments/menu/menu";
import {useFormik} from "formik";
import {schemaReset} from "../../schemas/schema"
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";
import "antd/lib/spin/style/index.css";
import emailInvalid from "../emailVerify/email_invalid.png"

function ResetPass() {
  const navigate = useNavigate();
  const [validUrl, setValidUrl] = useState(true);
  const [loading, setLoading] = useState(true);

  const param = useParams();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("")

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 30,
      }}
      spin
    />
  );

  useEffect(() => {
    const verifyEmailUrl = async () => {
      let forgotToken = searchParams.get("token");
      const response = await Axios.get(
        `https://leagueofquiz.netlify.app/users/${param.id}/reset-pass?token=${forgotToken}`
      );
      setUsername("Username: " + response.data.username)

      if (response.data.type === "error") {
        setValidUrl(false);
      }
      setLoading(false);
    };
    verifyEmailUrl();
  }, []);

  const resetPassF = async (values, actions) => {
    const response = await Axios.post("https://leagueofquiz.netlify.app/reset-password", {
        id: param.id,
        token: searchParams.get("token"),
        password: values.password,
        
    });

    if (response.data.type === "error") {
      notification[response.data.type]({
        message: response.data.message,
        description: response.data.description,
      });
    }else{
    notification[response.data.type]({
      message: response.data.message,
      description: response.data.description,
    });
    actions.resetForm();
    navigate("/login");
    }

  };

  const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: schemaReset,
    onSubmit: resetPassF,
  });

  return (
    <>
      <Menu />
      
    {loading ? (
      <div className="spin-container">
        <Spin indicator={antIcon} />
      </div>
    ) : (
      <>
      {validUrl ? (
        <>
        <div className="container-reset-pass">
        <form autoComplete="off" name="form1" className="box" onSubmit={handleSubmit}>
        <h5 className="titlu">RESET YOUR PASSWORD</h5>
          <input type="text" placeholder="Username"
          id="username"
          value={username}
          className="username"
          readonly="readonly"
          />
          <input type="password" placeholder="Passsword"
          id="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.password && touched.password ? "input-error" : "password"}
          />
          {errors.password && touched.password && <p className="error-message">{errors.password}</p>}
          <input type="password" placeholder="Confirm Password"
          id="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.confirmPassword && touched.confirmPassword ? "input-error" : "confirmPassword"}
          />
          {errors.confirmPassword && touched.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          <button type="submit" className="btn2"> Submit </button>
        </form></div> </>
      ) : (
        <>
        <div className="spin-container">
                <img
                  style={{ height: "250px" }}
                  src={emailInvalid}
                  alt="linkInvalid"
                ></img>
                
                <h2> Invalid reset password link</h2>
                <div className= "flex-row">
                <h3>Try to request a new reset link on Login page</h3>
                </div>
                </div>
              </>
      )}
      </>
    )}
    
    </>
  );
}

export default ResetPass;
