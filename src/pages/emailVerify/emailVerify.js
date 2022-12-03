import "./emailVerify.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import {
  useNavigate,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Menu from "../../fragments/menu/menu";
import emailValid from "./email_valid.png";
import emailInvalid from "./email_invalid.png";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "antd/lib/spin/style/index.css";

function EmailVerify() {
  const [validUrl, setValidUrl] = useState(true);
  const [loading, setLoading] = useState(true);

  const param = useParams();
  const [searchParams] = useSearchParams();

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
      let emailToken = searchParams.get("token");
      const response = await Axios.get(
        `https://licenta-server-production.up.railway.app/users/${param.id}/verify-email?token=${emailToken}`
      );
      if (response.data.type === "error") {
        setValidUrl(false);
      }
      setLoading(false);
    };
    verifyEmailUrl();
  }, []);

  return (
    <>
      <Menu />
      <div className="email-verify-container">
        {loading ? (
          <Spin indicator={antIcon} />
        ) : (
          <>
            {validUrl ? (
              <>
                <img
                  style={{ height: "250px" }}
                  src={emailValid}
                  alt="emailValid"
                ></img>
                <h2>Your email address has been verified</h2>
                <h3>Now you can login</h3>
              </>
            ) : (
              <>
                <img
                  style={{ height: "250px" }}
                  src={emailInvalid}
                  alt="emailInvalid"
                ></img>
                
                <h2>Your email address could not be verified (invalid or already used link)</h2>
                <div className= "flex-row">
                <h3>Try to login on your account and request a new verification link!</h3>
                </div>
                
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default EmailVerify;
