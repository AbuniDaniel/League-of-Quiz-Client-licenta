import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import "./easy44.css";
import answer_button from "./answer-button.png"
import hint_button from "./hint-button.png"
import { authContext } from "../../helpers/authContext"
import { Result } from 'antd';
import "antd/lib/result/style/index.css";
import { Link } from "react-router-dom";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";
import { useNavigate} from "react-router-dom";
import FlipNumbers from 'react-flip-numbers';

let champions;
// "http://localhost:3001"
let url = "http://localhost:3001";

function Easy44(prop) {
  const navigate = useNavigate();
  const { authState, setAuthState } = useContext(authContext);

  const [filter, setFilter] = useState('');
  const [imgpath, setImgPath] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  const [isVisible5, setIsVisible5] = useState(false);
  const [isVisible6, setIsVisible6] = useState(false);
  const [isVisible7, setIsVisible7] = useState(false);
  const [isVisible8, setIsVisible8] = useState(false);
  const [isVisible9, setIsVisible9] = useState(false);
  const [isVisible10, setIsVisible10] = useState(false);
  const [isVisible11, setIsVisible11] = useState(false);
  const [isVisible12, setIsVisible12] = useState(false);
  const [isVisible13, setIsVisible13] = useState(false);
  const [isVisible14, setIsVisible14] = useState(false);
  const [isVisible15, setIsVisible15] = useState(false);
  const [isVisible16, setIsVisible16] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isHintButtonDisabled, setIsHintButtonDisabled] = useState(false);
  const [hints, setHints] = useState(0);

  const [gameId, setGameId] = useState(null);
  const [signature, setSignature] = useState(null);

  let imagine1, imagine2, imagine3, imagine4, imagine5, imagine6, imagine7, imagine8, imagine9, imagine10, imagine11, imagine12, imagine13, imagine14, imagine15, imagine16;
  let dificulty;

  useEffect(() => {
    if(authState.status){
      const startGame = async () => {
        if(prop.selectGame === "easy44")
          dificulty = "img"
        else
          dificulty = "skin1"
        const response = await Axios.post(url+"/select-champion", {
          id: authState.id,
          game_type: prop.selectGame,
          dificulty: dificulty,
        })
        if(response.data.message){
          navigate("/")
          notification[response.data.type]({
            message: response.data.message,
          });
        }
          setImgPath(response.data.img);
          setGameId(response.data.gameId);
          setSignature(response.data.signature);
          setIsVisible1(false);
          setIsVisible2(false);
          setIsVisible3(false);
          setIsVisible4(false);
          setIsVisible5(false);
          setIsVisible6(false);
          setIsVisible7(false);
          setIsVisible8(false);
          setIsVisible9(false);
          setIsVisible10(false);
          setIsVisible11(false);
          setIsVisible12(false);
          setIsVisible13(false);
          setIsVisible14(false);
          setIsVisible15(false);
          setIsVisible16(false);
          hintFunc();
          
          const response2 = await Axios.get(url+"/champion-options")
          champions = response2.data;
      }
  
      startGame();
      hintAmount();
  }
  // eslint-disable-next-line
  }, []);

  const checkAnswer = async () => {
    setIsButtonDisabled(true)
      if(champions.includes(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase())) {
        if(prop.selectGame === "easy44")
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
        gameId: gameId,
        signature: signature
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
      if(response.data.type === "success"){
        setAuthState({ ...authState, coins: authState.coins+response.data.coins})
        setImgPath("");
        setIsVisible1(false);
      setIsVisible2(false);
      setIsVisible3(false);
      setIsVisible4(false);
      setIsVisible5(false);
      setIsVisible6(false);
      setIsVisible7(false);
      setIsVisible8(false);
      setIsVisible9(false);
      setIsVisible10(false);
      setIsVisible11(false);
      setIsVisible12(false);
      setIsVisible13(false);
      setIsVisible14(false);
      setIsVisible15(false);
      setIsVisible16(false);
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
      if(prop.selectGame === "easy44")
          dificulty = "img"
        else
          dificulty = "skin1"
      const response = await Axios.post(url+"/select-champion", {
        id: authState.id,
        game_type: prop.selectGame,
        dificulty: dificulty,
      })

      setImgPath(response.data.img);
      setGameId(response.data.gameId);
      setSignature(response.data.signature);
      const response2 = await Axios.get(url+"/champion-options")
      champions = response2.data;
      hintFunc();
  };
  const handleEnter = (event) => {
    if (event.key === 'Enter') 
        checkAnswer()
    };

  const hintButton = async() => {
    setIsHintButtonDisabled(true)
    imagine1 = document.querySelector(".img144").style.cssText[12];
    imagine2 = document.querySelector(".img244").style.cssText[12];
    imagine3 = document.querySelector(".img344").style.cssText[12];
    imagine4 = document.querySelector(".img444").style.cssText[12];
    imagine5 = document.querySelector(".img544").style.cssText[12];
    imagine6 = document.querySelector(".img644").style.cssText[12];
    imagine7 = document.querySelector(".img744").style.cssText[12];
    imagine8 = document.querySelector(".img844").style.cssText[12];
    imagine9 = document.querySelector(".img944").style.cssText[12];
    imagine10 = document.querySelector(".img1044").style.cssText[12];
    imagine11 = document.querySelector(".img1144").style.cssText[12];
    imagine12 = document.querySelector(".img1244").style.cssText[12];
    imagine13 = document.querySelector(".img1344").style.cssText[12];
    imagine14 = document.querySelector(".img1444").style.cssText[12];
    imagine15 = document.querySelector(".img1544").style.cssText[12];
    imagine16 = document.querySelector(".img1644").style.cssText[12];
    if(imagine1 === "v" && imagine2 === "v" && imagine3 === "v" && imagine4 === "v" && imagine5 === "v" && imagine6 === "v" && imagine7 === "v" && imagine8 === "v" && imagine9 === "v" && imagine10 === "v" && imagine11 === "v" && imagine12 === "v" && imagine13 === "v" && imagine14 === "v" && imagine15 === "v" && imagine16 === "v")
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
    setIsHintButtonDisabled(false)
  };

  const hintFunc = () => {
    imagine1 = document.querySelector(".img144").style.cssText[12];
    imagine2 = document.querySelector(".img244").style.cssText[12];
    imagine3 = document.querySelector(".img344").style.cssText[12];
    imagine4 = document.querySelector(".img444").style.cssText[12];
    imagine5 = document.querySelector(".img544").style.cssText[12];
    imagine6 = document.querySelector(".img644").style.cssText[12];
    imagine7 = document.querySelector(".img744").style.cssText[12];
    imagine8 = document.querySelector(".img844").style.cssText[12];
    imagine9 = document.querySelector(".img944").style.cssText[12];
    imagine10 = document.querySelector(".img1044").style.cssText[12];
    imagine11 = document.querySelector(".img1144").style.cssText[12];
    imagine12 = document.querySelector(".img1244").style.cssText[12];
    imagine13 = document.querySelector(".img1344").style.cssText[12];
    imagine14 = document.querySelector(".img1444").style.cssText[12];
    imagine15 = document.querySelector(".img1544").style.cssText[12];
    imagine16 = document.querySelector(".img1644").style.cssText[12];
    let selector = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
    let gata = false;
      while(gata === false){
        let random = selector[Math.floor(Math.random() * selector.length)];
        console.log(random);
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

        else if (random === 5 && imagine5 === "h"){
          gata = true;
          setIsVisible5(true);
        }
  
        else if (random === 6 && imagine6 === "h"){
          gata = true;
          setIsVisible6(true);
        }
  
        else if (random === 7 && imagine7 === "h"){
          gata = true;
          setIsVisible7(true);
        }
  
        else if (random === 8 && imagine8 === "h"){
          gata = true;
          setIsVisible8(true);
        }
        else if (random === 9 && imagine9 === "h"){
          gata = true;
          setIsVisible9(true);
        }
  
        else if (random === 10 && imagine10 === "h"){
          gata = true;
          setIsVisible10(true);
        }
  
        else if (random === 11 && imagine11 === "h"){
          gata = true;
          setIsVisible11(true);
        }
  
        else if (random === 12 && imagine12 === "h"){
          gata = true;
          setIsVisible12(true);
        }
        else if (random === 13 && imagine13 === "h"){
          gata = true;
          setIsVisible13(true);
        }
  
        else if (random === 14 && imagine14 === "h"){
          gata = true;
          setIsVisible14(true);
        }
  
        else if (random === 15 && imagine15 === "h"){
          gata = true;
          setIsVisible15(true);
        }
  
        else if (random === 16 && imagine16 === "h"){
          gata = true;
          setIsVisible16(true);
        }
      }
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
        <button className="hint-button" style={{filter: isHintButtonDisabled ? 'brightness(70%)' : ''}} onClick={hintButton} disabled={isHintButtonDisabled}><img src={hint_button} alt="hint_button"/></button>
        <p className="hint-text"><FlipNumbers height={16} width={12} play={true} duration={1} perspective={70} numbers={`${hints}`} /></p>
        </div>
        <input id="filter"
          placeholder="Type champion name..."
          name="filter"
          type="textt"
          value={filter}
          onChange={event => setFilter(event.target.value)}
          autoComplete = "off"
          onFocus={() => setIsVisible(true)}
          onKeyDown={handleEnter}
        />
        
        <button className="guess-button" style={{filter: isButtonDisabled ? 'brightness(70%)' : ''}} onClick={checkAnswer} disabled={isButtonDisabled}><img src={answer_button} alt="answer_button"/></button>
      </div>

      <ul>
      <div className="lista"
      style={{
        visibility: isVisible ? 'visible' : 'hidden'
      }} >
      {champions?.filter(f => f.startsWith(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()) && filter !== '')
        .map(f => <button key={f} onClick={() => {setFilter(f); setIsVisible(false)}} className="guess-word"><span>{f}</span> </button>)}
      </div>
      </ul>
      </div>

      <div className="grid44" style={{pointerEvents: 'none'}}>
        <div className="gridimg44" ><img className="img144" style={{visibility: isVisible1 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img244" style={{visibility: isVisible2 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img344" style={{visibility: isVisible3 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img444" style={{visibility: isVisible4 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img544" style={{visibility: isVisible5 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img644" style={{visibility: isVisible6 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img744" style={{visibility: isVisible7 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img844" style={{visibility: isVisible8 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img944" style={{visibility: isVisible9 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1044" style={{visibility: isVisible10 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1144" style={{visibility: isVisible11 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1244" style={{visibility: isVisible12 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1344" style={{visibility: isVisible13 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1444" style={{visibility: isVisible14 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1544" style={{visibility: isVisible15 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg44" ><img className="img1644" style={{visibility: isVisible16 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
      </div>
    </div>
            </>
            :
            <>  
  
            </>
    }
    
  </>
  );

}

export default Easy44;
