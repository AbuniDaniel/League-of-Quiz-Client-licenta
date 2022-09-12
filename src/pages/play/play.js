import Menu from  "../../fragments/menu/menu";
import {useState, useEffect} from "react";
import Axios from "axios";
import "./play.css";
import answer_button from "./answer-button.png"
import hint_button from "./hint-button.png"

function Play() {
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
  const [imagini] = useState([1,2,3,4]);

  useEffect(() => {
    Axios.get("http://localhost:3001/champion").then((response) => {
      setImgPath(response.data[0].img);
      setAnswer(response.data[0].answer);
    });

    hintButton();

  }, []);

  const checkAnswer = () => {
    if(filter === answer)
      console.log("bv gion")
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

    console.log(imagini)
      
  };

  return (
    <div className="wrapper">
      <Menu />
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
        
        <button className="guess-button" onClick={checkAnswer}><img src={answer_button} alt="answer_button"/></button>
      </div>

      <ul>
      <div className="lista"
      style={{
        visibility: isVisible ? 'visible' : 'hidden'
      }} >
      {fruit.filter(f => f.startsWith(filter) && filter !== '')
        .map(f => <button onClick={() => {setFilter(f); setIsVisible(false)}} className="hatz" key={f}>{f} </button>)}
      </div>
      </ul>


      <div className="grid">
        <div className="gridimg" ><img className="img1" style={{visibility: isVisible1 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img2" style={{visibility: isVisible2 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img3" style={{visibility: isVisible3 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
        <div className="gridimg" ><img className="img4" style={{visibility: isVisible4 ? 'visible' : 'hidden'}} src={imgpath} alt="loading champion"/></div>
      </div>
    </div>
    
  );

}

export default Play;