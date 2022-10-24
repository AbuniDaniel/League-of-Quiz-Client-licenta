// eslint-disable react/no-array-index-key
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import "./easy22.css";
import answer_button from "./answer-button.png"
import hint_button from "./hint-button.png"
import { authContext } from "../../helpers/authContext"
import { Result } from 'antd';
import "antd/lib/result/style/index.css";
import { Link } from "react-router-dom";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

let champions;
// "https://daniel-licenta-api.herokuapp.com"
let url = "https://daniel-licenta-api.herokuapp.com";


function Easy22(prop) {

  const { authState } = useContext(authContext);

  const [filter, setFilter] = useState('');
  const [imgpath, setImgPath] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  // const [imagini, setImagini] = useState([1,2,3,4]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hints, setHints] = useState(0);
  let imagine1, imagine2, imagine3, imagine4;
  let dificulty;

  useEffect(() => {
    console.log(prop.selectGame)
    if(authState.status){
      const startGame = async () => {
        if(prop.selectGame === "easy22")
          dificulty = "img"
        else
          dificulty = "skin1"
        const response = await Axios.post(url+"/select-champion", {
          id: authState.id,
          game_type: prop.selectGame,
          dificulty: dificulty,
        })
          setImgPath(response.data);

          setIsVisible1(false);
          setIsVisible2(false);
          setIsVisible3(false);
          setIsVisible4(false);
          hintFunc();
          
          const response2 = await Axios.get(url+"/champion-options")
          champions = response2.data;
      }
  
      startGame();
      hintAmount();
  }
  // eslint-disable-next-line
  }, [authState]);
  const checkAnswer = async () => {
    console.log(authState.username);
    setIsButtonDisabled(true)
      if(champions.includes(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase())) {
        if(prop.selectGame === "easy22")
          dificulty = "img"
        else
          dificulty = "skin1"
        const response = await Axios.post(url+"/check-answer", {
        id: authState.id,
        username: authState.username,
        answer: filter.toLowerCase(),
        imgpath: imgpath,
        game_type: prop.selectGame,
        dificulty: dificulty,
      })

      notification[response.data.type]({
        message: response.data.message,
        description: response.data.description,
      });

      if(response.data.type2){
        notification[response.data.type2]({
          message: response.data.message2,
          description: response.data.description2,
        });
        hintAmount();
      }

      setFilter("");
      if(response.data.type === "success")
      {
        restartGame();
      } 
      }
      else{
        notification["warning"]({
          message: "Champion doesn't exist",
          description: "",
        });
      }
      setIsButtonDisabled(false)
  };

  const restartGame = async () => {
      setIsButtonDisabled(false);
      if(prop.selectGame === "easy22")
          dificulty = "img"
        else
          dificulty = "skin1"
      const response = await Axios.post(url+"/select-champion", {
        id: authState.id,
        game_type: prop.selectGame,
        dificulty: dificulty,
      })

      setImgPath(response.data);

      setIsVisible1(false);
      setIsVisible2(false);
      setIsVisible3(false);
      setIsVisible4(false);
      const response2 = await Axios.get(url+"/champion-options")
      champions = response2.data;
      hintFunc();
  };
  const handleEnter = (event) => {
    if (event.key === 'Enter') 
        checkAnswer()
    };

  const hintButton = async() => {
    setIsButtonDisabled(true)
    imagine1 = document.querySelector(".img1").style.cssText[12];
    imagine2 = document.querySelector(".img2").style.cssText[12];
    imagine3 = document.querySelector(".img3").style.cssText[12];
    imagine4 = document.querySelector(".img4").style.cssText[12];
    if(imagine1 === "v" && imagine2 === "v" && imagine3 === "v" && imagine4 === "v")
    {
      notification["error"]({
        message: "You have reached the maximum number of hints for this picture",
        description: "",
      });
    }
    else{
      const response = await Axios.post(url+"/hint", {
        id: authState.id,
      })

      if(response.data.type === "success"){
        hintFunc();
        hintAmount();
      }
      notification[response.data.type]({
      message: response.data.message,
      description: response.data.description,
    });
    }
    setIsButtonDisabled(false)
  };

  const hintFunc = () => {
    imagine1 = document.querySelector(".img1").style.cssText[12];
    imagine2 = document.querySelector(".img2").style.cssText[12];
    imagine3 = document.querySelector(".img3").style.cssText[12];
    imagine4 = document.querySelector(".img4").style.cssText[12];
    let selector = [1,2,3,4];
    let gata = false;
    while(gata === false){
      let random = selector[Math.floor(Math.random() * selector.length)];

      if (random === 1 && imagine1 === "h"){
        gata = true;
        setIsVisible1(true);
      }

      else if (random === 2 && imagine2 === "h"){
        gata = true;
        setIsVisible2(true);
      }

      else if (random === 3 && imagine3 === "h"){
        gata = true;
        setIsVisible3(true);
      }

      else if (random === 4 && imagine4 === "h"){
        gata = true;
        setIsVisible4(true);
      }
        
    }
      
      // const index = imagini.indexOf(random);
      // imagini.splice(index,1);
      // imagini = ["yooo"];
      // console.log(imagini);

      // setImagini(oldArray => oldArray.splice(index,1));
      // setImagini(oldArray => {
      //   return oldArray.filter((value, i) => i !== index)})
    }

  const hintAmount = async() => {
    const response = await Axios.post(url+"/hints-amount", {
        id: authState.id,
      })
    setHints(response.data[0].hints);
  }

  return (
    
  <>
  {authState.status?
  <>
      <div className="wrapper">
      <div className="answers-list">
      <div className="answers">
        <div className="hint">
        <button className="hint-button" onClick={hintButton} disabled={isButtonDisabled}><img src={hint_button} alt="hint_button"/></button>
        <p className="hint-text">{hints}</p>
        </div>
        <input id="filter"
          placeholder="Type champion name..."
          name="filter"
          type="text"
          value={filter}
          onChange={event => setFilter(event.target.value)}
          autoComplete = "off"
          onFocus={() => setIsVisible(true)}
          onKeyDown={handleEnter}
        />
        
        <button className="guess-button" onClick={checkAnswer} disabled={isButtonDisabled}><img src={answer_button} alt="answer_button"/></button>
      </div>

      <ul>
      <div className="lista"
      style={{
        visibility: isVisible ? 'visible' : 'hidden'
      }} >
      {champions?.filter(f => f.startsWith(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()) && filter !== '')
        .map(f => <button key={f} onClick={() => {setFilter(f); setIsVisible(false)}} className="hatz" >{f} </button>)}
      </div>
      </ul>
      </div>

      <div className="grid" style={{pointerEvents: 'none'}}>
        <div className="gridimg" ><img className="img1" style={{visibility: isVisible1 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img2" style={{visibility: isVisible2 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img3" style={{visibility: isVisible3 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img4" style={{visibility: isVisible4 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
      </div>
    </div>
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
  </>
  );

}

export default Easy22;