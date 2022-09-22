import Menu from  "../../fragments/menu/menu";
import {useState, useEffect, useContext} from "react";
import Axios from "axios";
import "./play.css";
import answer_button from "./answer-button.png"
import hint_button from "./hint-button.png"
import { authContext } from "../../helpers/authContext"
import { Result } from 'antd';
import "antd/lib/result/style/index.css";
import { Link } from "react-router-dom";
import { notification } from 'antd';
import "antd/lib/notification/style/index.css";

let champions;

function Play() {

  const { authState } = useContext(authContext);

  const [filter, setFilter] = useState('');
  const [imgpath, setImgPath] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  const [imagini, setImagini] = useState([1,2,3,4]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hints, setHints] = useState(0);

  useEffect(() => {
    if(authState.status){
      const startGame = async () => {
        const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/select-champion", {
          id: authState.id,
        })
          setImgPath(response.data[0].img);
    
          setIsVisible1(false);
          setIsVisible2(false);
          setIsVisible3(false);
          setIsVisible4(false);
          hintFunc();
          
          const response2 = await Axios.get("https://daniel-licenta-api.herokuapp.com/champion-options")
          champions = response2.data;
      }
  
      startGame();
      hintAmount();
  }
  }, [authState]);

  const checkAnswer = async () => {
    setIsButtonDisabled(true)
      if(champions.includes(filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase())) {
        const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/check-answer", {
        id: authState.id,
        answer: filter.toLowerCase(),
        imgpath: imgpath,
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
          restartGame();
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
      
      const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/select-champion", {
        id: authState.id,
      })

      setImgPath(response.data[0].img);

      setIsVisible1(false);
      setIsVisible2(false);
      setIsVisible3(false);
      setIsVisible4(false);
      setImagini([1,2,3,4]);

      const response2 = await Axios.get("https://daniel-licenta-api.herokuapp.com/champion-options")
      champions = response2.data;
      hintFunc();
  };
  const handleEnter = (event) => {
    if (event.key === 'Enter') 
        checkAnswer()
    };

  const hintButton = async() => {
    setIsButtonDisabled(true)
    if(imagini.length === 0)
    {
      notification["error"]({
        message: "You have reached the maximum number of hints for this picture",
        description: "",
      });
    }
    else{
      const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/hint", {
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
    let random = imagini[Math.floor(Math.random() * imagini.length)];
      if (random === 1) setIsVisible1(true);
      if (random === 2) setIsVisible2(true);
      if (random === 3) setIsVisible3(true);
      if (random === 4) setIsVisible4(true);
      const index = imagini.indexOf(random);
      imagini.splice(index,1);
    }

  const hintAmount = async() => {
    const response = await Axios.post("https://daniel-licenta-api.herokuapp.com/hints-amount", {
        id: authState.id,
      })
    console.log(response.data[0].hints);
    setHints(response.data[0].hints);
  }

  return (
  <>
  <Menu />
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
        .map(f => <><button onClick={() => {setFilter(f); setIsVisible(false)}} className="hatz" key={f}>{f} </button></>)}
      </div>
      </ul>
      </div>

      <div className="grid">
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

export default Play;