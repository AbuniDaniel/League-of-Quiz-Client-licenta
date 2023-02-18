import Menu from  "../../fragments/menu/menu";
import Easy22 from "./easy22";
import Easy44 from "./easy44";
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import "./easy22.css";
import "./play.css";
import easy22poza from "./easy22.webp"
import easy44poza from "./easy44.webp"
import hard22poza from "./hard22.webp"
import hard44poza from "./hard44.webp"
import backButton from "./back-button.png"
import { authContext } from "../../helpers/authContext"
import { Result } from 'antd';
import "antd/lib/result/style/index.css";
import { useNavigate, Link } from "react-router-dom";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

function Play() {
  const navigate = useNavigate();
  const { authState } = useContext(authContext);
  const [selectGame, setSelectGame] = useState("play");

  const [xeasy22, setXeasy22] = useState(false);
  const [xeasy44, setXeasy44] = useState(false);
  const [xhard22, setXhard22] = useState(false);
  const [xhard44, setXhard44] = useState(false);

  useEffect(() => {
    selectGame === "easy22" ? setXeasy22(true) : setXeasy22(false);
    selectGame === "easy44" ? setXeasy44(true) : setXeasy44(false);
    selectGame === "hard22" ? setXhard22(true) : setXhard22(false);
    selectGame === "hard44" ? setXhard44(true) : setXhard44(false);
  }, [selectGame]);
  

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
  <Menu/>
  {authState.status?
  <>
    {selectGame === "play" &&
    <>
    <div className="wrapperPlay">
    <div className="select-play">
      <div className="games">
      <img src={easy22poza} alt="easy22"></img>
      <button className="btn403" onClick={easy22}>Easy 2x2</button>
      </div>
      <div className="games">
      <img src={easy44poza} alt="easy44"></img>
      <button className="btn403" onClick={easy44}>Easy 4x4</button>
      </div>
    </div>
    <div className="select-center">
    <div className="games">
      <img src={easy22poza} alt="easy22"></img>
      <button className="btn403" onClick={()=> {navigate("/multiplayer")}}>Multiplayer</button>
      </div>
    </div>
    <div className="select-play2">
      <div className="games">
      <img src={hard22poza} alt="hard22"></img>
      <button className="btn403" onClick={hard22}>Hard 2x2</button>
      </div>
      <div className="games">
      <img src={hard44poza} alt="hard44"></img>
      <button className="btn403" onClick={hard44}>Hard 4x4</button>
      </div>
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
    {xeasy22 &&
    <>
          <img className="backButton" onClick={()=> setSelectGame("play")} src={backButton}></img>
          <Easy22 selectGame = "easy22"/>
    </>
    }
    {xeasy44 &&
    <>
    <img className="backButton" onClick={()=> setSelectGame("play")} src={backButton}></img>
          <Easy44 selectGame = "easy44"/>
    </>
    }
    {xhard22 &&
    <>
    <img className="backButton" onClick={()=> setSelectGame("play")} src={backButton}></img>
          <Easy22 selectGame = "hard22"/>
    </>
    }
    {xhard44 &&
    <>
    <img className="backButton" onClick={()=> setSelectGame("play")} src={backButton}></img>
          <Easy44 selectGame = "hard44"/>
    </>
    }
  </>
  );

}

export default Play;