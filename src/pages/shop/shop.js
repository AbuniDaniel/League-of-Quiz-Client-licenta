import "./shop.css";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import Menu from "../../fragments/menu/menu";
import { notification } from "antd";
import "antd/lib/notification/style/index.css";
import points from "./points.png";

function Shop() {
  const [pfps, setPfps] = useState([]);
  const [userPfps, setUSerPfps] = useState([]);

  useEffect(() => {
    fetchShop();
    fetchUserPfps();
  }, []);

  const fetchShop = async () => {
    const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/shop");
    // setPageLoading(false)
    setPfps(response.data);
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
    setUSerPfps(response.data);
  };

  const buyItem = async (item_name) => {
    const response = await Axios.post(
      "https://daniel-licenta-api.herokuapp.com/buy-item",
      {
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
      fetchUserPfps()
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
        <button className="buy-btn" onClick={()=>buyItem(pfp_name)}>
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
        <p className="text-shop">Profile Pictures</p>
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
                        marginBottom: "5px",
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
        <p className="text-shop">Background Colors for Leaderboard</p>
      </div>
    </>
  );
}

export default Shop;
