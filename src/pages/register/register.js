import "./register.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Menu from  "../../fragments/menu/menu"
import {useFormik} from "formik";
import {schema} from "../../schemas/schema"
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

function Register() {
  const navigate = useNavigate();

  const register = (values, actions) => {
    Axios.post("https://daniel-licenta-api.herokuapp.com/register", {
      username: values.username,
      password: values.password,
      email: values.email,
    }).then((response) => {
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
  });
  };


  const {values, errors, touched, handleBlur, handleChange, handleSubmit} = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: register,
  });
  
  return (
    <><Menu />
    <div className="containerr">
    
    <form autoComplete="off" name="form1" className="box" onSubmit={handleSubmit}>
      
      <h5 className="titlu">CREATE AN ACCOUNT</h5>
        <input type="text" placeholder="Email"
        id="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.email && touched.email ? "input-error" : "email"}
        />
        {errors.email && touched.email && <p className="error-message">{errors.email}</p>}
        <input type="text" placeholder="Username"
        id="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.username && touched.username ? "input-error" : "username"}
        />
        {errors.username && touched.username && <p className="error-message">{errors.username}</p>}
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
        <button type="submit" className="btn2"> Register </button>
      </form>
        <Link to="/login" className="dnthave2">Already have an account?</Link>
    </div> 
    </>
  );
}

export default Register;