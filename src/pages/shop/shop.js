import "./shop.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Menu from "../../fragments/menu/menu";
import { notification } from "antd";
import "antd/lib/notification/style/index.css";
import points from "./points.png";
import { authContext } from "../../helpers/authContext"

function Shop() {
  const [pfps, setPfps] = useState([]);
  const [bgs, setBgs] = useState([]);
  const [userPfps, setUserPfps] = useState([]);
  const [userBg, setUserBg] = useState([]);
  const { authState, setAuthState } = useContext(authContext);

  useEffect(() => {
    fetchShopPfps();
    fetchUserPfps();
    fetchShopBg();
    fetchUserBg();
  }, []);

  const fetchShopPfps = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/shop-pfps");
    // setPageLoading(false)
    setPfps(response.data);
  };

  const fetchShopBg = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/shop-bg");
    // setPageLoading(false)
    setBgs(response.data);
  };

  const fetchUserPfps = async () => {
    const response = await Axios.post(
      "https://daniel-licenta-api.herokuapp.com/user-pfps",
      {},
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    setUserPfps(response.data);
  };

  const fetchUserBg = async () => {
    const response = await Axios.post(
      "https://daniel-licenta-api.herokuapp.com/user-bg",
      {},
      {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      }
    );
    setUserBg(response.data);
  };

  const buyItem = async (item_type, item_name) => {
    const response = await Axios.post(
      "https://daniel-licenta-api.herokuapp.com/buy-item",
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
        <button className="buy-btn" onClick={()=>buyItem("pfp",pfp_name)}>
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
        <button className="buy-btn" onClick={()=>buyItem("bg", bg_name)}>
          <span>BUY</span>
        </button>
          
        </>
      );
    }
  };

  return (
    <>
      <Menu />
      <div className="container-shop">
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
      </div>
    </>
  );
}

export default Shop;
