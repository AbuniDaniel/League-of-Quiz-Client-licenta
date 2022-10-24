import Menu from  "../../fragments/menu/menu";
import Easy22 from "./easy22";
import Easy44 from "./easy44";
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import "./easy22.css";
import "./play.css";
import easy22poza from "./easy22.png"
import easy44poza from "./easy44.png"
import { authContext } from "../../helpers/authContext"
import { Result } from 'antd';
import "antd/lib/result/style/index.css";
import { Link } from "react-router-dom";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

function Play() {

  const { authState } = useContext(authContext);
  const [selectGame, setSelectGame] = useState("");

  

  const easy22 = () => {
     setSelectGame("easy22");
  }

  const easy44 = () => {
    setSelectGame("easy44");
  }
  const hard22 = () => {
    setSelectGame("hard22");
 }

 const hard44 = () => {
   setSelectGame("hard44");
 }

  return (
  <>
  <Menu />
  {authState.status?
  <>
    {selectGame === "" &&
    <>
    <div className="select-play">
      <div className="games">
      <img src={easy22poza} alt="easy22"></img>
      <button className="btn403" onClick={easy22}>easy22</button>
      </div>
      <div className="games">
      <img src={easy44poza} alt="easy44"></img>
      <button className="btn403" onClick={easy44}>easy44</button>
      </div>
    </div>
    <div className="select-play2">
      <div className="games">
      <img src={easy22poza} alt="hard22"></img>
      <button className="btn403" onClick={hard22}>hard22</button>
      </div>
      <div className="games">
      <img src={easy22poza} alt="hard44"></img>
      <button className="btn403" onClick={hard44}>hard44</button>
      </div>
    </div>
    </>
    }
    
  </>
  :
  <> 
  <Result
    status="403"
    subTitle={<p className="msg403">Sorry, you are not authorized to access this page without being logged in</p>}
    extra={<><Link to="/login" className="btn403">Am deja cont</Link><p className="msg403">sau</p><Link to="/register" className="btn403">Creează un cont</Link></>}
  />
            </>
    }
    {selectGame === "easy22" &&
          <Easy22 selectGame = "easy22"/>
    }
    {selectGame === "hard22" &&
          <Easy22 selectGame = "hard22"/>
    }
    {selectGame === "easy44" &&
          <Easy44 selectGame = "easy44"/>
    }
    {selectGame === "hard44" &&
          <Easy44 selectGame = "hard44"/>
    }
  </>
  );

}

export default Play;