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
  const fruit = ['apple', 'banana', 'orange', 'grapefruit',
  'mango', 'strawberry', 'peach', 'apricot'];

  const [filter, setFilter] = useState('');
  const [imgpath, setImgPath] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isVisible3, setIsVisible3] = useState(false);
  const [isVisible4, setIsVisible4] = useState(false);
  const [answer, setAnswer] = useState("");
  const [imagini, setImagini] = useState([1,2,3,4]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  const checkAnswer = async () => {
    setIsButtonDisabled(true)
    if(filter === answer){
      console.log(filter, "  ", answer);
      setFilter("");
      notification["success"]({
        message: "Correct answer",
        description: "+1 ShopPoints added to your account",
      });
      startGame();
      await Axios.put("https://daniel-licenta-api.herokuapp.com/correct-answer", {
        id: authState.id,
      })
    }
    else{setIsButtonDisabled(false);}
  };

  const startGame = async () => {
      setIsButtonDisabled(false);
      
      const response = await Axios.get("https://daniel-licenta-api.herokuapp.com/champion")
      setImgPath(response.data[0].img);
      setAnswer(response.data[0].answer);

      setIsVisible1(false);
      setIsVisible2(false);
      setIsVisible3(false);
      setIsVisible4(false);
      setImagini([1,2,3,4]);
      hintButton();

      const response2 = await Axios.get("https://daniel-licenta-api.herokuapp.com/champion-options")
      champions = response2.data;

  };
  const handleEnter = (event) => {
    if (event.key === 'Enter') 
        checkAnswer()
    };

  const hintButton = () => {
    let random = imagini[Math.floor(Math.random() * imagini.length)];
    if (random === 1) setIsVisible1(true);
    if (random === 2) setIsVisible2(true);
    if (random === 3) setIsVisible3(true);
    if (random === 4) setIsVisible4(true);

    const index = imagini.indexOf(random);
    imagini.splice(index,1);
      
  };

  return (
  <>
  <Menu />
  {authState.status?
            <>
                <div className="wrapper">
      <div className="answers-list">
      <div className="answers">
        <button className="hint-button" onClick={hintButton}><img src={hint_button} alt="hint_button"/></button>
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
      {champions?.filter(f => f.startsWith(filter) && filter !== '')
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