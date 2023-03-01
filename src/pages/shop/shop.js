import "./shop.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Menu from "../../fragments/menu/menu";
import { notification, Popconfirm } from "antd";
import "antd/lib/notification/style/index.css";
import "antd/lib/popover/style/index.css";
import "../profile/antdCss/modal_button.css";
import points from "./points.png";
import { authContext } from "../../helpers/authContext"
import hint_points from "../play/hint-button.png";
import { Spin } from "antd";
import "antd/lib/spin/style/index.css";
import { LoadingOutlined } from "@ant-design/icons";

function Shop() {
  const [pfps, setPfps] = useState([]);
  const [bgs, setBgs] = useState([]);
  const [userPfps, setUserPfps] = useState([]);
  const [userBg, setUserBg] = useState([]);
  const { authState, setAuthState } = useContext(authContext);
  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(false);
  const [isBuyButtonDisabledBg, setIsBuyButtonDisabledBg] = useState(false);
  const [amount, setAmount] = useState(0);

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 30,
      }}
      spin
    />
  );

  const showPopconfirm = () => {
    if(!isNaN(amount) && parseInt(amount) > 0)
      setOpen(true);
    else{
      notification["error"]({
        message: "Invalid amount",
        description: '',
      });
    }
  };
  const handleOk = () => {
    setConfirmLoading(true);

    buyItem("hintPoints", amount);

    setOpen(false);
    setConfirmLoading(false);
    
  };
  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchShopPfps();
    fetchUserPfps();
    fetchShopBg();
    fetchUserBg();
  }, []);

  const fetchShopPfps = async () => {
    const response = await Axios.get("http://localhost:3001/shop-pfps");
    setPfps(response.data);
  };

  const fetchShopBg = async () => {
    const response = await Axios.get("http://localhost:3001/shop-bg");
    setBgs(response.data);
  };

  const fetchUserPfps = async () => {
    const response = await Axios.post(
      "http://localhost:3001/user-pfps",
      {},
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    setUserPfps(response.data);
    setIsBuyButtonDisabled(false)
    setLoading(false)
  };

  const fetchUserBg = async () => {
    const response = await Axios.post(
      "http://localhost:3001/user-bg",
      {},
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    setUserBg(response.data);
    setIsBuyButtonDisabledBg(false)
  };

  const buyItem = async (item_type, item_name) => {
    setIsBuyButtonDisabled(true)
    setIsBuyButtonDisabledBg(true)
    if(item_type === "hintPoints"){
      const response = await Axios.post(
        "http://localhost:3001/buy-item",
        {
          item_type: item_type,
          item_name: item_name,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      if(response.data.type === "success"){
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
        setAuthState({ ...authState, coins: response.data.coins})
      }
      else{
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
      }
    }
    else{
      const response = await Axios.post(
        "http://localhost:3001/buy-item",
        {
          item_type: item_type,
          item_name: item_name,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      );
      if(response.data.type === "success"){
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
        setAuthState({ ...authState, coins: response.data.coins})
        fetchUserPfps();
        fetchUserBg();
      }
      else{
        notification[response.data.type]({
          message: response.data.message,
          description: response.data.description,
        });
      }
    }
    
    
  };

  const buyTextButton = (pfp_name) => {
    let found = false;
    for (var i = 0; i < userPfps.length; ++i) {
      if (userPfps[i].pfp_name == pfp_name) {
        found = true;
        break;
      }
    }
    if (found) {
      return (
        <>
        <button className="buy-btn-already">
          <span>Item Already Owned</span>
        </button>
        </>
      );
    } else {
      return (
        <>
        <button className="buy-btn" disabled={isBuyButtonDisabled} onClick={()=>buyItem("pfp",pfp_name)}>
          <span>BUY</span>
        </button>
          
        </>
      );
    }
  };

  const buyTextButtonBg = (bg_name) => {
    let found = false;
    for (var i = 0; i < userBg.length; ++i) {
      if (userBg[i].bg_name == bg_name) {
        found = true;
        break;
      }
    }
    if (found) {
      return (
        <>
        <button className="buy-btn-already">
          <span>Item Already Owned</span>
        </button>
        </>
      );
    } else {
      return (
        <>
        <button className="buy-btn" disabled={isBuyButtonDisabledBg} onClick={()=>buyItem("bg", bg_name)}>
          <span>BUY</span>
        </button>
          
        </>
      );
    }
  };

  const buyHintPointsText = () => {
    return(
      <div>
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>Are you sure you want to buy {amount} HintPoints for {amount*3}&nbsp;<img style={{ width: "20px" }} src={points}></img></span>
      </div>
    )
  }

  return (
    <>
      <Menu />
      <div className="container-shop">
      {loading ? (
          <div className="loading-shop">
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <>
            <h2 className="text-shop">HintPoints</h2>
      <div className="container-images">

                <div className="container-background">
                <img
                    className="hintPointsImg"
                    src={hint_points}
                  ></img>
                  <div className="container-text-buy">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <span className="price-text">3</span>
                      <img style={{ width: "20px" }} src={points}></img>
                      <span className="price-text">&nbsp; = 1 Hint Point</span>
                      
                    </div>
                    <input className="input-hint-points"
                    placeholder="Amount..."
                    type="text"
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}/>
                    <Popconfirm
                    title={buyHintPointsText()}
                    open={open}
                    onConfirm={handleOk}
                    bodyStyle={{ backgroundColor: "#303952" }}
                    okButtonProps={{
                      loading: confirmLoading,
                    }}
                    onCancel={handleCancel}
                    >
                    <button className="buy-btn" onClick={showPopconfirm}>
                      <span>BUY</span>
                    </button>
                    </Popconfirm>
                    
                  </div>
                </div>
        </div>

        <h2 className="text-shop">Profile Pictures</h2>
        <div className="container-images">
          {pfps.map((val, key) => {
            return (
              <>
                <div className="container-avatar">
                  <img
                    className="shopPfpImg"
                    src={`data:image;base64,${val.src}`}
                  ></img>
                  <div className="container-text-buy">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "7px",
                      }}
                    >
                      <span className="price-text">{val.price}</span>
                      <img style={{ width: "20px" }} src={points}></img>
                    </div>

                      {buyTextButton(val.pfp_name)}

                  </div>
                </div>
              </>
            );
          })}
        </div>
        <h2 className="text-shop">Background Colors for Leaderboard</h2>
        
        <div className="container-images">
        {bgs.map((val, key) => {
            return (
              <>
                <div className="container-background">
                <div className={val.item} style={{height: 70, width: 170}}></div>
                  <div className="container-text-buy">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <span className="price-text">{val.price}</span>
                      <img style={{ width: "20px" }} src={points}></img>
                    </div>

                    {buyTextButtonBg(val.item)}

                  </div>
                </div>
              </>
            );
          })}
        </div>
          </>
        )}
      </div>
    </>
  );
}

export default Shop;
